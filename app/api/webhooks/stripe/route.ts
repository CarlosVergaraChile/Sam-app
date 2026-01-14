import Stripe from "stripe";

export const runtime = "nodejs"; // requerido para Stripe SDK

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-12-15.clover" as any,
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new Response("Missing Stripe signature or webhook secret", { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text(); // raw body needed for signature verification
  } catch {
    return new Response("Unable to read request body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err?.message ?? "unknown"}`, { status: 400 });
  }

  // Minimal handlers (expand later)
  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "invoice.paid":
      // TODO: persist to DB / update subscription status
      break;
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true, type: event.type }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
