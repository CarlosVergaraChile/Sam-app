import { NextResponse } from 'next/server';

// Early Bird pricing configuration
const EARLY_BIRD_END = '2026-02-28T23:59:00Z';
const EARLY_BIRD_PRICE_CLP = 7990;
const REGULAR_PRICE_CLP = 9990;

export async function GET() {
  const now = new Date();
  const endDate = new Date(EARLY_BIRD_END);
  const isEarlyBird = now < endDate;

  return NextResponse.json({
    activePrice: isEarlyBird ? EARLY_BIRD_PRICE_CLP : REGULAR_PRICE_CLP,
    label: isEarlyBird ? 'EARLY_BIRD' : 'REGULAR',
    endsAt: EARLY_BIRD_END,
    isActive: isEarlyBird,
  });
}
