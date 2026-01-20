import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/groq-test
 * Verifica que Groq API esté configurado y funcionando
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'GROQ_API_KEY no configurado',
          instructions: [
            '1. Ve a https://console.groq.com/keys',
            '2. Copia tu API key',
            '3. Agrega a .env.local: GROQ_API_KEY=tu-key',
            '4. Reinicia npm run dev'
          ]
        },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    // Test simple: verificar que la API responda
    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'user',
          content: 'Di una palabra: hola'
        }
      ],
      max_tokens: 100,
    });

    const content = completion.choices?.[0]?.message?.content || '';

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Groq API configurado correctamente',
        model: 'mixtral-8x7b-32768',
        available: true,
        response: content,
        timestamp: new Date().toISOString(),
        limits: {
          requestsPerMinute: 30,
          tier: 'free',
          cost: '$0'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Groq Test] Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/groq-test
 * Genera contenido usando Groq (para testing)
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY no configurado' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { prompt, model = 'mixtral-8x7b-32768' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Se requiere un prompt' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content || '';

    return NextResponse.json(
      {
        status: 'ok',
        prompt,
        response: content,
        model,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Groq Test POST] Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
