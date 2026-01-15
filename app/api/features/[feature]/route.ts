import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ enabled: false }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', session.user.id)
      .eq('feature_name', params.feature)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching feature:', error);
      return NextResponse.json({ enabled: false }, { status: 500 });
    }

    return NextResponse.json({ enabled: data?.enabled || false }, { status: 200 });
  } catch (error) {
    console.error('Feature check error:', error);
    return NextResponse.json({ enabled: false }, { status: 500 });
  }
}
