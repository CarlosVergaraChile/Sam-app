import { NextResponse } from 'next/server';

/**
 * Comprehensive Platform Health Check
 * Returns status of all critical components
 * GET /api/health - Full detailed health report
 * HEAD /api/health - Simple 200/500 ping
 */

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  environment: string;
  components: {
    llm: {
      configured: boolean;
      providers: string[];
    };
    payments: {
      stripe: boolean;
      mercadopago: boolean;
    };
    database: {
      supabase: boolean;
    };
    webhooks: {
      stripe: boolean;
      mercadopago: boolean;
    };
  };
  readiness: 'ready' | 'degraded' | 'error';
  issues: string[];
}

export async function GET() {
  const health: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '6.0.0',
    environment: process.env.NODE_ENV || 'unknown',
    components: {
      llm: {
        configured: false,
        providers: [],
      },
      payments: {
        stripe: false,
        mercadopago: false,
      },
      database: {
        supabase: false,
      },
      webhooks: {
        stripe: false,
        mercadopago: false,
      },
    },
    readiness: 'ready',
    issues: [],
  };

  // Check LLM Providers
  const llmProviders = [
    { name: 'Gemini', envVars: ['LLM_API_KEY_GEMINI', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'] },
    { name: 'OpenAI', envVars: ['LLM_API_KEY_OPENAI', 'OPENAI_API_KEY'] },
    { name: 'DeepSeek', envVars: ['LLM_API_KEY_DEEPSEEK', 'DEEPSEEK_API_KEY'] },
    { name: 'Anthropic', envVars: ['LLM_API_KEY_ANTHROPIC', 'ANTHROPIC_API_KEY'] },
    { name: 'Perplexity', envVars: ['LLM_API_KEY_PERPLEXITY', 'PERPLEXITY_API_KEY'] },
  ];

  for (const provider of llmProviders) {
    const configured = provider.envVars.some((key) => process.env[key]);
    if (configured) {
      health.components.llm.providers.push(provider.name);
      health.components.llm.configured = true;
    }
  }

  if (!health.components.llm.configured) {
    health.issues.push('⚠️ No LLM API key configured. Add at least one of: LLM_API_KEY_GEMINI, LLM_API_KEY_OPENAI, etc.');
    health.readiness = 'degraded';
  }

  // Check Stripe
  const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
  const hasStripeWebhook = !!process.env.STRIPE_WEBHOOK_SECRET;
  health.components.payments.stripe = hasStripeSecret && hasStripeWebhook;
  health.components.webhooks.stripe = hasStripeWebhook;

  if (!health.components.payments.stripe) {
    health.issues.push('⚠️ Stripe not fully configured. Need: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET');
    health.readiness = 'degraded';
  }

  // Check Mercado Pago
  const hasMercadoPagoToken = !!process.env.MERCADO_PAGO_ACCESS_TOKEN;
  health.components.payments.mercadopago = hasMercadoPagoToken;
  health.components.webhooks.mercadopago = hasMercadoPagoToken;

  if (!health.components.payments.mercadopago) {
    health.issues.push('ℹ️ Mercado Pago not configured (optional). Add MERCADO_PAGO_ACCESS_TOKEN for regional payment support.');
  }

  // Check Supabase
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  health.components.database.supabase = hasSupabaseUrl && hasSupabaseKey;

  if (!health.components.database.supabase) {
    health.issues.push('⚠️ Supabase not configured. Database features will not work.');
    health.readiness = 'degraded';
  }

  // Check if at least ONE payment method is available
  const hasAnyPaymentMethod = health.components.payments.stripe || health.components.payments.mercadopago;
  if (!hasAnyPaymentMethod) {
    health.issues.push('❌ CRITICAL: No payment gateway configured. Configure Stripe OR Mercado Pago.');
    health.readiness = 'error';
    health.status = 'error';
  }

  // Warnings for production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.STRIPE_SECRET_KEY?.includes('test')) {
      health.issues.push('❌ CRITICAL: Using Stripe TEST keys in production!');
      health.readiness = 'error';
      health.status = 'error';
    }
  }

  const statusCode = health.readiness === 'error' ? 500 : 200;

  return NextResponse.json(health, { status: statusCode });
}

export async function HEAD() {
  // Simple ping endpoint for monitoring
  return new Response(null, { status: 200 });
}
