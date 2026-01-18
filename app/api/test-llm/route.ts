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

// Simple test generation - NO authentication required
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    // Try Gemini first
    const geminiKey = process.env.LLM_API_KEY_GEMINI || 
                      process.env.GOOGLE_API_KEY || 
                      process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return NextResponse.json({
        error: 'No Gemini API key found',
        hint: 'Add LLM_API_KEY_GEMINI or GOOGLE_API_KEY to your environment variables',
      }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
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

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: `Gemini API error: ${response.status}`,
        details: errorText,
      }, { status: response.status });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      success: true,
      provider: 'gemini',
      material: text,
      prompt: prompt,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Test generation failed',
      message: error.message,
    }, { status: 500 });
  }
}
