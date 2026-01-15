import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COST_MODEL: Record<string, number> = {
  basic: 1,
  advanced: 2,
  premium: 3,
};

function log(requestId: string, userId: string | null, message: string, meta?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ requestId, userId, timestamp, message, ...meta }));
}

async function generateMaterial(prompt: string, userId: string, mode: string, llmEnabled: boolean): Promise<string> {
  if (!llmEnabled) {
    return `Generated Material (${mode})\n---\nThis is a stub response for user ${userId}. In production, this would call the actual LLM service with mode=${mode}.\n\nTimestamp: ${new Date().toISOString()}`;
  }

  // TODO: Integrate actual LLM provider (OpenAI, Anthropic, etc.)
  // For now, return stub with note that LLM is enabled
  return `LLM Material (${mode}) - Mode\n---\nActual LLM integration pending. Prompt: ${prompt.substring(0, 50)}...\n\nTimestamp: ${new Date().toISOString()}`;
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  let userId: string | null = null;
  let creditsCost = 0;

  try {
    // Parse body
    const body = await request.json();
    const mode = body.mode || 'basic';
    const prompt = body.prompt || 'No prompt provided';

    if (!COST_MODEL[mode]) {
      return NextResponse.json(
        { error: 'Invalid mode', code: 'INVALID_MODE' },
        { status: 400 }
      );
    }

    creditsCost = COST_MODEL[mode];

    // Get session
    const token = request.cookies.get('sb-token')?.value;
    if (!token) {
      log(requestId, null, 'Unauthorized: no session token');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_SESSION' },
        { status: 401 }
      );
    }

    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      log(requestId, null, 'Unauthorized: invalid token', { authError: authError?.message });
      return NextResponse.json(
        { error: 'Unauthorized', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }
    userId = user.id;

    // Check feature
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

    // Check LLM flag
    const { data: llmFlag } = await supabase
      .from('feature_flags')
      .select('is_enabled')
      .eq('feature_name', 'llm_enabled')
      .single();

    const llmEnabled = llmFlag?.is_enabled ?? false;

    // Consume credits atomically
    const { data: creditResult, error: creditError } = await supabase
      .rpc('consume_credit', {
        p_user_id: user.id,
        p_amount: creditsCost,
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
      log(requestId, userId, 'Insufficient credits', { balance: new_balance, required: creditsCost });
      return NextResponse.json(
        { error: creditMsg || 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' },
        { status: 402 }
      );
    }

    // Generate material
    const material = await generateMaterial(prompt, user.id, mode, llmEnabled);

    // Persist to database (non-critical: if fails, log warning but don't fail request)
    try {
      await supabase.from('generated_materials').insert({
        user_id: user.id,
        prompt,
        material,
        request_id: requestId,
        mode,
      });
    } catch (persistError) {
      log(requestId, userId, 'Warning: material persistence failed', { error: String(persistError) });
      // Continue anyway - credits already deducted
    }

    log(requestId, userId, 'Material generated successfully', {
      creditsRemaining: new_balance,
      mode,
      creditsCost,
    });

    return NextResponse.json(
      {
        ok: true,
        material,
        creditsRemaining: new_balance,
        mode,
        requestId,
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
