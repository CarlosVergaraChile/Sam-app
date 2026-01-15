import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Logging utility
function log(requestId: string, userId: string | null, message: string, meta?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ requestId, userId, timestamp, message, ...meta }));
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  let userId: string | null = null;

  try {
    // Get session from cookies
    const token = request.cookies.get('sb-token')?.value;
    if (!token) {
      log(requestId, null, 'Unauthorized: no session token');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_SESSION' },
        { status: 401 }
      );
    }

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      log(requestId, null, 'Unauthorized: invalid token', { authError: authError?.message });
      return NextResponse.json(
        { error: 'Unauthorized', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }
    userId = user.id;

    // Check if user has generador feature enabled
    const { data: featureRow, error: featureError } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', user.id)
      .eq('feature_name', 'generador')
      .single();

    if (featureError || !featureRow?.enabled) {
      log(requestId, userId, 'Feature disabled', { featureError: featureError?.message });
      return NextResponse.json(
        { error: 'Feature not enabled', code: 'FEATURE_NOT_ENABLED' },
        { status: 403 }
      );
    }

    // Call RPC to consume 1 credit atomically
    const { data: creditResult, error: creditError } = await supabase
      .rpc('consume_credit', {
        p_user_id: user.id,
        p_amount: 1,
      });

    if (creditError || !creditResult || creditResult.length === 0) {
      log(requestId, userId, 'Credit deduction failed', { creditError: creditError?.message });
      return NextResponse.json(
        { error: 'Failed to consume credit', code: 'CREDIT_ERROR' },
        { status: 500 }
      );
    }

    const { success, new_balance, error: creditMsg } = creditResult[0];
    if (!success) {
      log(requestId, userId, 'Insufficient credits', { balance: new_balance });
      return NextResponse.json(
        { error: creditMsg || 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' },
        { status: 402 }
      );
    }

    // Generate stub material
    const material = `Generated Material\n---\nThis is a stub response for user ${user.email}. In production, this would call the actual generador service.\n\nTimestamp: ${new Date().toISOString()}`;
    
    log(requestId, userId, 'Material generated successfully', { creditsRemaining: new_balance });

    return NextResponse.json(
      {
        ok: true,
        material,
        creditsRemaining: new_balance,
      },
      {
        status: 200,
        headers: {
          'X-Request-ID': requestId,
        },
      }
    );
  } catch (error) {
    log(requestId, userId, 'Unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
