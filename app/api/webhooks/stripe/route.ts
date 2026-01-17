import Stripe from "stripe";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {});
}

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    return new Response(
      `Signature verification failed: ${err?.message ?? "unknown"}`,
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "invoice.paid":
      break;
    default:
      break;
  }

  return Response.json(
    { received: true, type: event.type },
    { status: 200 }
  );
}
