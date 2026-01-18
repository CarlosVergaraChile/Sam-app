import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to discover available Gemini models
 * Call this to see what models actually exist in the v1 API
 */

export async function GET(request: NextRequest) {
  const geminiKey = process.env.LLM_API_KEY_GEMINI || 
                    process.env.GOOGLE_API_KEY || 
                    process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return NextResponse.json({
      error: 'No Gemini API key found',
      models: [],
    });
  }

  try {
    // Try to list available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${geminiKey}`
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({
        error: `Failed to list models: ${response.status}`,
        details: error,
        models: [],
      });
    }

    const data = await response.json();
    const models = data.models || [];
    
    // Filter to show only supported models for generateContent
    const generativeModels = models.filter((m: any) => 
      m.supportedGenerationMethods?.includes('generateContent')
    );

    return NextResponse.json({
      status: 'ok',
      total_models: models.length,
      generative_models_count: generativeModels.length,
      generative_models: generativeModels.map((m: any) => ({
        name: m.name,
        display_name: m.displayName,
        description: m.description,
      })),
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to fetch models',
      message: error.message,
    }, { status: 500 });
  }
}
