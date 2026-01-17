import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { isEnabled: false, error: 'Server misconfigured' },
        { status: 500 }
      );
    }
    // Get session token from cookies
    const token = req.cookies.get('sb-token')?.value;
    if (!token) {
      return NextResponse.json(
        { isEnabled: false, error: 'No session' },
        { status: 401 }
      );
    }

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { isEnabled: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check user-specific feature flag
    const { data: featureRow, error: featureError } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', user.id)
      .eq('feature_name', 'generador')
      .single();

    if (featureError || !featureRow) {
      // Feature not assigned, check global flag
      const { data: globalFlag } = await supabase
        .from('feature_flags')
        .select('is_enabled')
        .eq('feature_name', 'generador')
        .single();
      
      return NextResponse.json({
        isEnabled: globalFlag?.is_enabled || false,
      });
    }

    return NextResponse.json({
      isEnabled: featureRow.enabled || false,
    });
  } catch (error) {
    console.error('Feature check error:', error);
    return NextResponse.json(
      { isEnabled: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
