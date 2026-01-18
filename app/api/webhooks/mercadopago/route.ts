import { NextRequest, NextResponse } from 'next/server';

/**
 * Mercado Pago Webhook Handler
 * Receives payment notifications from Mercado Pago
 * 
 * Webhook URL: https://your-domain.com/api/webhooks/mercadopago
 * Configure in Mercado Pago Seller Center > Preferences > Notifications
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // MP webhook structure: ?topic=payment&id=123456
    const topic = request.nextUrl.searchParams.get('topic');
    const mpId = request.nextUrl.searchParams.get('id');

    if (!topic || !mpId) {
      return NextResponse.json(
        { error: 'Missing topic or id' },
        { status: 400 }
      );
    }

    console.log(`[Mercado Pago Webhook] Topic: ${topic}, ID: ${mpId}`);

    // Validate webhook signature (optional but recommended)
    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');
    
    // TODO: Implement signature validation
    // Reference: https://www.mercadopago.com/developers/es/reference/ipn/_notifications_topic/post

    switch (topic) {
      case 'payment':
        await handlePaymentNotification(mpId);
        break;
      case 'plan':
        console.log('[MP Webhook] Plan notification:', mpId);
        break;
      case 'subscription':
        console.log('[MP Webhook] Subscription notification:', mpId);
        break;
      case 'invoice':
        console.log('[MP Webhook] Invoice notification:', mpId);
        break;
      default:
        console.log('[MP Webhook] Unknown topic:', topic);
    }

    // Always return 200 OK to Mercado Pago
    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error: any) {
    console.error('Mercado Pago webhook error:', error);
    // Still return 200 to prevent retries
    return NextResponse.json(
      { error: error.message },
      { status: 200 }
    );
  }
}

async function handlePaymentNotification(mpPaymentId: string) {
  try {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      console.error('Mercado Pago token not configured');
      return;
    }

    // Fetch payment details from Mercado Pago API
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${mpPaymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch MP payment ${mpPaymentId}`);
      return;
    }

    const payment = await response.json();

    console.log(`[MP Payment] ID: ${payment.id}, Status: ${payment.status}, Amount: ${payment.transaction_amount}`);

    // Handle payment status
    switch (payment.status) {
      case 'approved':
        console.log(`✅ Payment ${payment.id} APPROVED`);
        // TODO: Update user subscription in database
        // TODO: Grant access to features
        break;
      case 'pending':
        console.log(`⏳ Payment ${payment.id} PENDING`);
        // TODO: Wait for confirmation or ask user to complete payment
        break;
      case 'rejected':
        console.log(`❌ Payment ${payment.id} REJECTED`);
        // TODO: Notify user of rejection
        break;
      case 'cancelled':
        console.log(`⚠️ Payment ${payment.id} CANCELLED`);
        // TODO: Log cancellation
        break;
      case 'refunded':
        console.log(`🔄 Payment ${payment.id} REFUNDED`);
        // TODO: Revoke subscription access
        break;
      case 'charged_back':
        console.log(`⚠️ Payment ${payment.id} CHARGED_BACK`);
        // TODO: Handle chargeback
        break;
    }

    // Log full payment details for debugging
    console.log('[MP Payment Details]', {
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      payment_method: payment.payment_method_id,
      payer_email: payment.payer?.email,
      external_reference: payment.external_reference,
      created_at: payment.date_created,
      approval_date: payment.date_approved,
    });
  } catch (error: any) {
    console.error('Error handling MP payment notification:', error);
  }
}
