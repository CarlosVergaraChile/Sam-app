import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const COST_MODEL: Record<string, number> = {
  basic: 1,
  advanced: 2,
  premium: 3,
};

const LLM_PROVIDERS = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    header: 'x-api-key',
    model: 'claude-3-sonnet-20240229',
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    header: 'authorization',
    model: 'gpt-4-turbo',
  },
};

function log(requestId: string, userId: string | null, message: string, meta?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ requestId, userId, timestamp, message, ...meta }));
}

async function generateMaterialWithLLM(
  prompt: string,
  mode: string,
  apiKey: string,
  provider: string = 'anthropic'
): Promise<{ material: string; latency_ms: number; success: boolean }> {
  const startTime = Date.now();
  const timeout = mode === 'basic' ? 5000 : mode === 'advanced' ? 10000 : 15000;

  try {
    const config = LLM_PROVIDERS[provider as keyof typeof LLM_PROVIDERS];
    if (!config) throw new Error(`Unknown provider: ${provider}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        [config.header]: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        provider === 'anthropic'
          ? {
              model: config.model,
              max_tokens: mode === 'basic' ? 500 : mode === 'advanced' ? 1500 : 2500,
              messages: [{ role: 'user', content: prompt }],
            }
          : {
              model: config.model,
              max_tokens: mode === 'basic' ? 500 : mode === 'advanced' ? 1500 : 2500,
              messages: [{ role: 'user', content: prompt }],
            }
      ),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const material =
      provider === 'anthropic'
        ? data.content?.[0]?.text || ''
        : data.choices?.[0]?.message?.content || '';

    if (!material) throw new Error('Empty response from LLM');

    const latency_ms = Date.now() - startTime;
    return { material, latency_ms, success: true };
  } catch (error) {
    const latency_ms = Date.now() - startTime;
    return {
      material: '',
      latency_ms,
      success: false,
    };
  }
}

async function generateMaterial(
  prompt: string,
  userId: string,
  mode: string,
  llmEnabled: boolean
): Promise<{ material: string; llmUsed: boolean; latency_ms: number }> {
  if (!llmEnabled) {
    const latency_ms = Math.random() * 100 + 50;
    return {
      material: `[STUB] Generated Material (${mode})\n---\nThis is a stub response for user ${userId}. In production, this would call the actual LLM service with mode=${mode}.\n\nTimestamp: ${new Date().toISOString()}`,
      llmUsed: false,
      latency_ms: Math.round(latency_ms),
    };
  }

  const apiKey = process.env.LLM_API_KEY;
  const provider = process.env.LLM_PROVIDER || 'anthropic';

  if (!apiKey) {
    return {
      material: `[FALLBACK] LLM API key not configured. Using stub.\n\nTimestamp: ${new Date().toISOString()}`,
      llmUsed: false,
      latency_ms: 0,
    };
  }

  const result = await generateMaterialWithLLM(prompt, mode, apiKey, provider);

  if (!result.success) {
    return {
      material: `[FALLBACK] LLM generation failed (timeout or error). Using stub.\n\nOriginal prompt: ${prompt}\nTimestamp: ${new Date().toISOString()}`,
      llmUsed: false,
      latency_ms: result.latency_ms,
    };
  }

  return {
    material: result.material,
    llmUsed: true,
    latency_ms: result.latency_ms,
  };
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  let userId: string | null = null;
  let creditsCost = 0;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      log(requestId, null, 'Supabase configuration missing');
      return NextResponse.json(
        { error: 'Server misconfigured', code: 'SUPABASE_CONFIG_MISSING' },
        { status: 500 }
      );
    }
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

    const token = request.cookies.get('sb-token')?.value;
    if (!token) {
      log(requestId, null, 'Unauthorized: no session token');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_SESSION' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      log(requestId, null, 'Unauthorized: invalid token', { authError: authError?.message });
      return NextResponse.json(
        { error: 'Unauthorized', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }
    userId = user.id;

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

    const { data: llmFlag } = await supabase
      .from('feature_flags')
      .select('is_enabled')
      .eq('feature_name', 'llm_enabled')
      .single();

    const llmEnabled = llmFlag?.is_enabled ?? false;

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

    const { material, llmUsed, latency_ms } = await generateMaterial(
      prompt,
      user.id,
      mode,
      llmEnabled
    );

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
    }

    log(requestId, userId, 'Material generated successfully', {
      creditsRemaining: new_balance,
      mode,
      creditsCost,
      llmUsed,
      latency_ms,
      provider: llmEnabled ? process.env.LLM_PROVIDER || 'anthropic' : 'stub',
    });

    return NextResponse.json(
      {
        ok: true,
        material,
        creditsRemaining: new_balance,
        mode,
        requestId,
        llmUsed,
        latency_ms,
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
