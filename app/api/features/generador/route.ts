import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a service role client to access auth.users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Get user email from query params
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');

    // If no email provided, check global feature flag
    if (!userEmail) {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('is_enabled')
        .eq('feature_name', 'generador')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ isEnabled: data?.is_enabled || false });
    }

    // Check user-specific feature flag
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users.find(u => u.email === userEmail);

    if (!user) {
      return NextResponse.json({ isEnabled: false });
    }

    const { data: featureData, error: featureError } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', user.id)
      .eq('feature_name', 'generador')
      .single();

    if (featureError) {
      // Feature not assigned to user, check global flag
      const { data: globalFlag } = await supabase
        .from('feature_flags')
        .select('is_enabled')
        .eq('feature_name', 'generador')
        .single();
      
      return NextResponse.json({ isEnabled: globalFlag?.is_enabled || false });
    }

    return NextResponse.json({ isEnabled: featureData?.enabled || false });
  } catch (error) {
    console.error('Feature flag error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
