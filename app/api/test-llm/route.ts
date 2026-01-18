import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple test endpoint - NO authentication required
export async function GET(request: NextRequest) {
  const availableKeys = {
    gemini: !!(
      process.env.LLM_API_KEY_GEMINI ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY
    ),
    openai: !!(process.env.LLM_API_KEY_OPENAI || process.env.OPENAI_API_KEY),
    deepseek: !!(process.env.LLM_API_KEY_DEEPSEEK || process.env.DEEPSEEK_API_KEY),
    anthropic: !!(process.env.LLM_API_KEY_ANTHROPIC || process.env.ANTHROPIC_API_KEY),
    perplexity: !!(process.env.LLM_API_KEY_PERPLEXITY || process.env.PERPLEXITY_API_KEY),
  };

  const hasAnyKey = Object.values(availableKeys).some(v => v);

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    llmAvailable: hasAnyKey,
    providers: availableKeys,
    message: hasAnyKey 
      ? 'At least one LLM provider is configured' 
      : 'No LLM API keys found. Add one of: LLM_API_KEY_GEMINI, GOOGLE_API_KEY, LLM_API_KEY_OPENAI, etc.',
  });
}

// Simple test generation - with automatic fallback between providers
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    // Try Gemini with different model names in priority order
    const geminiKey = process.env.LLM_API_KEY_GEMINI || 
                      process.env.GOOGLE_API_KEY || 
                      process.env.GEMINI_API_KEY;

    // Try Gemini first with different model names
    if (geminiKey) {
      const geminiModels = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-pro-latest'];
      
      for (const model of geminiModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiKey}`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return NextResponse.json({
              success: true,
              provider: 'gemini',
              model: model,
              material: text,
              prompt: prompt,
            });
          }
        } catch (e) {
          console.log(`Gemini model ${model} failed, trying next...`);
        }
      }
    }

    // Fallback to OpenAI
    const openaiKey = process.env.LLM_API_KEY_OPENAI || process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({
          success: true,
          provider: 'openai',
          material: text,
          prompt: prompt,
        });
      }
    }

    // Fallback to DeepSeek
    const deepseekKey = process.env.LLM_API_KEY_DEEPSEEK || process.env.DEEPSEEK_API_KEY;
    if (deepseekKey) {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({
          success: true,
          provider: 'deepseek',
          material: text,
          prompt: prompt,
        });
      }
    }

    // No provider worked
    return NextResponse.json({
      error: 'All LLM providers failed',
      hint: 'Make sure you have at least one valid API key: LLM_API_KEY_GEMINI, LLM_API_KEY_OPENAI, or LLM_API_KEY_DEEPSEEK',
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Test generation failed',
      message: error.message,
    }, { status: 500 });
  }
}
