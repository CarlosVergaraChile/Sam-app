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
  gemini: {
    // Usar la lista de modelos disponibles detectados (Gemini v1 stable)
    models: [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-2.0-flash-lite-001',
      'gemini-2.0-flash-lite',
    ],
    url_template: 'https://generativelanguage.googleapis.com/v1/models/{model}:generateContent',
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    header: 'authorization',
    model: 'gpt-4o-mini',
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    header: 'x-api-key',
    model: 'claude-3-5-sonnet-20241022',
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    header: 'authorization',
    model: 'deepseek-chat',
  },
  perplexity: {
    url: 'https://api.perplexity.ai/chat/completions',
    header: 'authorization',
    model: 'llama-3.1-sonar-small-128k-online',
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
  provider: string = 'gemini'
): Promise<{ material: string; latency_ms: number; success: boolean }> {
  const startTime = Date.now();
  // Give more time on premium to avoid early aborts
  const timeout = mode === 'basic' ? 10000 : mode === 'advanced' ? 20000 : 45000;

  try {
    const config = LLM_PROVIDERS[provider as keyof typeof LLM_PROVIDERS];
    if (!config) throw new Error(`Unknown provider: ${provider}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Set auth header based on provider
    if (provider === 'gemini') {
      // Gemini uses query parameter for API key, not header in generateContent
    } else if (provider === 'openai' || provider === 'deepseek' || provider === 'perplexity') {
      headers['authorization'] = `Bearer ${apiKey}`;
    } else if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    }

    const maxTokens = mode === 'basic' ? 4000 : mode === 'advanced' ? 16000 : 32000;

    let requestBody: any;
    let requestUrl = '';

    // Aumentar límites para Gemini que soporta más tokens
    const geminiMaxTokens = mode === 'basic' ? 4000 : mode === 'advanced' ? 12000 : 24000;

    if (provider === 'gemini') {
      const models = (config as any).models || [];
      let success = false;
      for (const model of models) {
        const urlTemplate = (config as any).url_template as string;
        requestUrl = `${urlTemplate.replace('{model}', model)}?key=${apiKey}`;
        requestBody = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: geminiMaxTokens,
            temperature: 0.7,
          },
        };

        const response = await fetch(requestUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          const material = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (material) {
            const latency_ms = Date.now() - startTime;
            return { material, latency_ms, success: true };
          }
        }
      }
      throw new Error('All Gemini models failed');
    } else if (provider === 'anthropic') {
      requestUrl = (config as any).url;
      requestBody = {
        model: (config as any).model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      };
    } else {
      // OpenAI, DeepSeek, Perplexity (OpenAI-compatible)
      requestUrl = (config as any).url;
      requestBody = {
        model: (config as any).model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      };
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let material = '';

    if (provider === 'anthropic') {
      material = data.content?.[0]?.text || '';
    } else {
      // OpenAI, DeepSeek, Perplexity
      material = data.choices?.[0]?.message?.content || '';
    }

    if (!material) throw new Error('Empty response from LLM');

    const latency_ms = Date.now() - startTime;
    return { material, latency_ms, success: true };
  } catch (error) {
    const latency_ms = Date.now() - startTime;
    console.error(`LLM generation failed for ${provider}:`, error);
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
): Promise<{ material: string; llmUsed: boolean; latency_ms: number; provider?: string }> {
  if (!llmEnabled) {
    const latency_ms = Math.random() * 100 + 50;
    return {
      material: `[STUB] Generated Material (${mode})\n---\nThis is a stub response for user ${userId}. In production, this would call the actual LLM service with mode=${mode}.\n\nTimestamp: ${new Date().toISOString()}`,
      llmUsed: false,
      latency_ms: Math.round(latency_ms),
    };
  }

  // Try providers in order of preference
  // Prioritize Gemini (has credits) over OpenAI (free trial exhausted)
  const providerPriority = ['gemini', 'openai', 'deepseek', 'anthropic', 'perplexity'];

  const getApiKeyForProvider = (p: string): string | undefined => {
    switch (p) {
      case 'gemini':
        return (
          process.env.LLM_API_KEY_GEMINI ||
          process.env.GOOGLE_API_KEY ||
          process.env.GEMINI_API_KEY || process.env.LLM_API_KEY
        );
      case 'openai':
        return process.env.LLM_API_KEY_OPENAI || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
      case 'deepseek':
        return process.env.LLM_API_KEY_DEEPSEEK || process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY;
      case 'anthropic':
        return process.env.LLM_API_KEY_ANTHROPIC || process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
      case 'perplexity':
        return process.env.LLM_API_KEY_PERPLEXITY || process.env.PERPLEXITY_API_KEY || process.env.LLM_API_KEY;
      default:
        return undefined;
    }
  };
  
  console.log('DEBUG: Starting provider iteration...');
  console.log('DEBUG: Environment variables check:', {
    gemini: !!(process.env.LLM_API_KEY_GEMINI || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.LLM_API_KEY),
    openai: !!(process.env.LLM_API_KEY_OPENAI || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY),
    deepseek: !!(process.env.LLM_API_KEY_DEEPSEEK || process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY),
    anthropic: !!(process.env.LLM_API_KEY_ANTHROPIC || process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY),
    perplexity: !!(process.env.LLM_API_KEY_PERPLEXITY || process.env.PERPLEXITY_API_KEY || process.env.LLM_API_KEY),
  });
  console.log('DEBUG: Provider priority order:', providerPriority);
  
  for (const provider of providerPriority) {
    const apiKey = getApiKeyForProvider(provider);
    console.log(`DEBUG: Checking ${provider}, has key: ${!!apiKey}`);
    if (!apiKey) continue; // Skip if no API key for this provider

    console.log(`Trying provider: ${provider}`);
    const result = await generateMaterialWithLLM(prompt, mode, apiKey, provider);

    if (result.success) {
      return {
        material: result.material,
        llmUsed: true,
        latency_ms: result.latency_ms,
        provider,
      };
    }
  }

  // Fallback if all providers failed
  return {
    material: `[FALLBACK] Todos los proveedores fallaron o no hay API keys configuradas.\n\nConfigura al menos una API key en variables de entorno (cualquiera de estos nombres):\n- LLM_API_KEY_GEMINI / GOOGLE_API_KEY / GEMINI_API_KEY\n- LLM_API_KEY_OPENAI / OPENAI_API_KEY\n- LLM_API_KEY_DEEPSEEK / DEEPSEEK_API_KEY\n- LLM_API_KEY_ANTHROPIC / ANTHROPIC_API_KEY\n- LLM_API_KEY_PERPLEXITY / PERPLEXITY_API_KEY\n\nHora: ${new Date().toISOString()}`,
    llmUsed: false,
    latency_ms: 0,
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

    // Check if any LLM is available
    const availableKeys = {
      gemini: !!(process.env.LLM_API_KEY_GEMINI || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.LLM_API_KEY),
      openai: !!(process.env.LLM_API_KEY_OPENAI || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY),
      deepseek: !!(process.env.LLM_API_KEY_DEEPSEEK || process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY),
      anthropic: !!(process.env.LLM_API_KEY_ANTHROPIC || process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY),
      perplexity: !!(process.env.LLM_API_KEY_PERPLEXITY || process.env.PERPLEXITY_API_KEY || process.env.LLM_API_KEY),
    };
    
    const hasAnyKey = Object.values(availableKeys).some(v => v);
    
    log(requestId, userId, 'Generating material', { 
      mode, 
      creditsCost, 
      llmEnabled: hasAnyKey,
      availableKeys 
    });

    const { material, llmUsed, latency_ms, provider } = await generateMaterial(
      prompt,
      userId,
      mode,
      hasAnyKey
    );

    log(requestId, userId, 'Material generated successfully', {
      mode,
      llmUsed,
      latency_ms,
      provider,
    });

    return NextResponse.json(
      {
        material,
        creditsRemaining: 100, // Demo credits
        mode,
        llmUsed,
        latency_ms,
        provider,
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
