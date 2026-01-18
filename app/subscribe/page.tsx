'use client';

import { useState } from 'react';

type PaymentMethod = 'stripe' | 'mercadopago' | null;

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_1SpIBTAaDeOcsC00GasIgBeN' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong with Stripe');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create Stripe checkout session');
      setLoading(false);
    }
  };

  const handleMercadoPagoCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: 'MONTHLY' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong with Mercado Pago');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create Mercado Pago checkout session');
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === 'stripe') {
      handleStripeCheckout();
    } else if (paymentMethod === 'mercadopago') {
      handleMercadoPagoCheckout();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Suscribirse a SAM Evaluation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Acceso completo a evaluación IA y análisis de respuestas manuscritas
          </p>
        </div>

        {/* Plan Card */}
        <div className="rounded-lg bg-white px-6 py-8 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Plan Mensual</h3>
              <p className="mt-1 text-sm text-gray-500">Acceso completo a todas las características</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">$9,990</div>
              <div className="text-xs text-gray-500">CLP/mes</div>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {[
              'Evaluación automática de respuestas manuscritas',
              'Reconocimiento OCR avanzado',
              'Retroalimentación impulsada por IA',
              'Evaluación en tiempo real',
              'Acceso a historial de evaluaciones',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Selecciona tu método de pago:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stripe Option */}
            <button
              onClick={() => {
                setPaymentMethod('stripe');
                setError(null);
              }}
              className={`relative p-4 border-2 rounded-lg transition-all ${
                paymentMethod === 'stripe'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => {}}
                  className="h-4 w-4 text-indigo-600"
                />
                <label className="ml-3 block text-sm font-medium text-gray-900">
                  💳 Tarjeta de Crédito
                  <span className="block text-xs text-gray-500 font-normal">Via Stripe (Global)</span>
                </label>
              </div>
            </button>

            {/* Mercado Pago Option */}
            <button
              onClick={() => {
                setPaymentMethod('mercadopago');
                setError(null);
              }}
              className={`relative p-4 border-2 rounded-lg transition-all ${
                paymentMethod === 'mercadopago'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="mercadopago"
                  checked={paymentMethod === 'mercadopago'}
                  onChange={() => {}}
                  className="h-4 w-4 text-indigo-600"
                />
                <label className="ml-3 block text-sm font-medium text-gray-900">
                  🏦 Mercado Pago
                  <span className="block text-xs text-gray-500 font-normal">Tarjeta, transferencia, efectivo</span>
                </label>
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading || !paymentMethod}
          className={`w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white transition-all ${
            loading || !paymentMethod
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            '✅ Continuar con el pago'
          )}
        </button>

        {/* Additional Info */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>ℹ️ Nota:</strong> Tu suscripción se renovará automáticamente cada mes. Puedes cancelarla en cualquier momento desde tu panel de control.
          </p>
        </div>
      </div>
    </div>
  );
}
