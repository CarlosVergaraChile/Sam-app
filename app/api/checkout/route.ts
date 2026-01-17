import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

// Early Bird Pricing Configuration
// Set to true to use Early Bird price ($7,990 CLP)
// Set to false to revert to base price + coupon ($9,990 CLP)
const EARLY_BIRD_END = '2026-02-28T23:59:00Z'; // Hard stop for Early Bird pricing
const USE_EARLY_BIRD_PRICE = new Date() < new Date(EARLY_BIRD_END); // Auto-switch based on date
const EARLY_BIRD_PRICE_ID = 'price_1SphYfAaDeOcsC00sisonidT'; // $7,990 CLP monthly

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    const { priceId: requestPriceId } = await request.json();
    
    // Use Early Bird price if enabled, otherwise use price from request
    // TODO: Remove Early Bird logic when reverting to base price + coupon FUNDADORES2026
    const priceId = USE_EARLY_BIRD_PRICE ? EARLY_BIRD_PRICE_ID : requestPriceId;

      const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
