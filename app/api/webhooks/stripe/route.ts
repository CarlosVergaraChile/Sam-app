import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("Missing signature or secret", { sig: !!sig, webhookSecret: !!webhookSecret });
    return new Response("Webhook Error: Missing signature or secret", { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    console.error("Failed to read request body", err);
    return new Response("Webhook Error: Cannot read body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log("Webhook event verified", event.type);
  } catch (err: any) {
    console.error("Webhook signature verification failed", err?.message);
    return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  // Handle the event
  console.log("Processing event:", event.type);
  
  switch (event.type) {
    case "checkout.session.completed":
      console.log("Checkout session completed", event.data.object.id);
      break;
    case "customer.subscription.created":
      console.log("Subscription created", event.data.object.id);
      break;
    case "invoice.paid":
      console.log("Invoice paid", event.data.object.id);
      break;
    default:
      console.log("Unhandled event type", event.type);
  }

  return new Response(JSON.stringify({ received: true, type: event.type }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
