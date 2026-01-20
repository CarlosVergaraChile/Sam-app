import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/groq-test
 * Stub: Groq SDK dependency removed
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'disabled',
      message: 'Groq test endpoint disabled - SDK dependency removed',
      timestamp: new Date().toISOString()
    },
    { status: 503 }
  );
}

/**
 * POST /api/groq-test
 * Stub: Groq SDK dependency removed
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'disabled',
      message: 'Groq test endpoint disabled - SDK dependency removed',
      timestamp: new Date().toISOString()
    },
    { status: 503 }
  );
}
