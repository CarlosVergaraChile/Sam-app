import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Early Bird Pricing Configuration
// Set to true to use Early Bird price ($7,990 CLP)
// Set to false to revert to base price + coupon ($9,990 CLP)
const USE_EARLY_BIRD_PRICE = true;
const EARLY_BIRD_PRICE_ID = 'price_1SphYfAaDeOcsC00sisonidT'; // $7,990 CLP monthly

export async function POST(request: NextRequest) {
  try {
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
