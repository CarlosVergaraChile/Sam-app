import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, subject = 'general', grade = 9 } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { ok: false, error: 'imageUrl is required' },
        { status: 400 }
      );
    }

    const result = {
      ok: true,
      payload: {
        extractedText: 'Sample extracted text from handwritten response',
        feedback: 'Good work! Your response demonstrates understanding.',
        score: 85,
        subject,
        grade,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Evaluate error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: 'Evaluate API endpoint', method: 'POST' },
    { status: 200 }
  );
}
