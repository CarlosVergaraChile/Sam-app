import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get session from cookies
    const token = request.cookies.get('sb-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_SESSION' },
        { status: 401 }
      );
    }

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Check if user has generador feature enabled
    const { data: featureRow, error: featureError } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', user.id)
      .eq('feature_name', 'generador')
      .single();

    if (featureError || !featureRow?.enabled) {
      return NextResponse.json(
        { error: 'Feature not enabled', code: 'FEATURE_NOT_ENABLED' },
        { status: 403 }
      );
    }

    // Call RPC to consume 1 credit atomically
    const { data: creditResult, error: creditError } = await supabase
      .rpc('consume_credit', {
        user_id: user.id,
        amount: 1,
      });

    if (creditError || !creditResult || creditResult.length === 0) {
      return NextResponse.json(
        { error: 'Failed to consume credit', code: 'CREDIT_ERROR' },
        { status: 500 }
      );
    }

    const { success, remaining_credits } = creditResult[0];

    if (!success) {
      return NextResponse.json(
        { error: 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' },
        { status: 402 }
      );
    }

    // Generate stub material
    const material = `Generated Material\n---\nThis is a stub response for user ${user.email}. In production, this would call the actual generador service.\n\nTimestamp: ${new Date().toISOString()}`;

    return NextResponse.json({
      ok: true,
      material,
      creditsRemaining: remaining_credits,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
