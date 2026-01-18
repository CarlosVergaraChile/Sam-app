import { NextRequest, NextResponse } from 'next/server';

/**
 * Mercado Pago Payment Gateway Integration
 * Handles payment preference creation for Mercado Pago checkout
 * 
 * Environment Variables Required:
 * - MERCADO_PAGO_ACCESS_TOKEN: Access token from Mercado Pago app credentials
 * - NEXT_PUBLIC_BASE_URL: Base URL for payment success/cancel redirects
 */

function getMercadoPagoToken() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) return null;
  return token;
}

// Pricing configuration
const PLANS = {
  MONTHLY: {
    title: 'Plan Mensual SAM',
    price: 9990, // CLP
    currency: 'CLP',
    description: 'Acceso mensual a SAM - Evaluación con IA',
  },
  EARLY_BIRD: {
    title: 'Plan Early Bird - SAM',
    price: 7990, // CLP
    currency: 'CLP',
    description: 'Acceso mensual con descuento Early Bird',
  },
};

const EARLY_BIRD_END = '2026-02-28T23:59:00Z';
const USE_EARLY_BIRD = new Date() < new Date(EARLY_BIRD_END);

export async function POST(request: NextRequest) {
  try {
    const token = getMercadoPagoToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Mercado Pago not configured' },
        { status: 500 }
      );
    }

    const { planType = 'MONTHLY' } = await request.json();
    
    // Use Early Bird price if available
    const plan = USE_EARLY_BIRD && planType === 'MONTHLY' ? PLANS.EARLY_BIRD : PLANS[planType as keyof typeof PLANS];
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Create preference request for Mercado Pago
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const preferenceData = {
      items: [
        {
          id: planType,
          title: plan.title,
          description: plan.description,
          picture_url: `${baseUrl}/logo.png`, // Optional: add your logo
          category_id: 'services',
          quantity: 1,
          unit_price: plan.price,
          currency_id: plan.currency,
        },
      ],
      payer: {
        // Pre-filled payer info (optional)
        email: undefined, // Will be provided by user in MP checkout
      },
      back_urls: {
        success: `${baseUrl}/gracias`,
        failure: `${baseUrl}/subscribe`,
        pending: `${baseUrl}/pending`,
      },
      auto_return: 'approved',
      external_reference: `sam-subscription-${Date.now()}`, // Unique reference
      marketplace_fee: 0,
      payment_type_id: 'account_money',
      processing_modes: ['aggregator', 'gateway'], // Allow credit card and other methods
    };

    // Create preference via Mercado Pago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${planType}-${Date.now()}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Mercado Pago API error:', error);
      return NextResponse.json(
        { error: 'Failed to create Mercado Pago preference' },
        { status: 500 }
      );
    }

    const preference = await response.json();

    // Return checkout URL for frontend redirect
    return NextResponse.json({
      url: preference.init_point, // Direct checkout URL
      preferenceId: preference.id,
    });
  } catch (error: any) {
    console.error('Mercado Pago checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
