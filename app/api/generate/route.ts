import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getSupabase() {
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
  let userId: string | null = 'demo-user'; // Temporary for testing
  let creditsCost = 0;

  try {
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

    // TEMPORARY: Skip authentication for testing
    const llmEnabled = false; // Use stub for now
    
    log(requestId, userId, 'Generating material (demo mode)', { mode, creditsCost });

    const { material, llmUsed, latency_ms } = await generateMaterial(
      prompt,
      userId,
      mode,
      llmEnabled
    );

    log(requestId, userId, 'Material generated successfully', {
      mode,
      llmUsed,
      latency_ms,
    });

    return NextResponse.json(
      {
        material,
        creditsRemaining: 100, // Demo credits
        mode,
        llmUsed,
        latency_ms,
      },
      {
        status: 200,
        headers: { 'X-Request-ID': requestId },
      }
    );
  } catch (err) {
    log(requestId, userId, 'Unexpected error', {
      error: err instanceof Error ? err.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error', code: 'UNEXPECTED_ERROR' },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    );
  }
}
