import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    // Get the user from cookies (JWT from Supabase)
    const token = request.cookies.get('sb-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Set auth header for Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;
    const featureName = params.feature;

    // Query user_features table
    const { data, error } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', userId)
      .eq('feature_name', featureName)
      .single();

    if (error) {
      // Feature not found = not enabled
      return NextResponse.json({ enabled: false }, { status: 200 });
    }

    return NextResponse.json({ enabled: data.enabled }, { status: 200 });
  } catch (error) {
    console.error('Feature check error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
