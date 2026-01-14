'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LS_KEY = 'sam_is_pro';

export default function SamPage() {
  const [isPro, setIsPro] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [responseText, setResponseText] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Efecto init: leer localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_KEY);
      if (stored === 'true') {
        setIsPro(true);
      }
    }
  }, []);

  // Efecto persist: cuando isPro cambia, actualizar localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isPro) {
        localStorage.setItem(LS_KEY, 'true');
      } else {
        localStorage.removeItem(LS_KEY);
      }
    }
  }, [isPro]);

  // Manejo del retorno desde Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === '1') {
      setIsPro(true);
      setShowBanner(true);
      // Limpiar URL
      router.replace('/sam');
    } else if (canceled === '1') {
      // No cambiar isPro, solo limpiar URL
      router.replace('/sam');
    }
  }, [searchParams, router]);

  const handleEvaluate = () => {
    if (!responseText.trim()) {
      alert('Por favor ingresa una respuesta para evaluar');
      return;
    }
    alert('Evaluaci\u00f3n simulada: ' + responseText.substring(0, 50));
  };

  const handleExport = () => {
    alert('Exportando resultados...');
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_1SpIBTAaDeOcsC00GasIgBeN' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error al crear checkout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Banner de éxito (solo en memoria) */}
      {showBanner && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">\u00a1Suscripci\u00f3n exitosa!</strong>
          <span className="block sm:inline"> Ahora tienes acceso a todas las funciones PRO.</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setShowBanner(false)}
          >
            <span className="text-2xl">\u00d7</span>
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SAM v6</h1>
        <p className="text-gray-600 mb-6">Automatic evaluation of handwritten student responses</p>

        {/* Estado PRO */}
        <div className="mb-6">
          {isPro ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              \u2713 Plan PRO Activo
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Plan Free
            </span>
          )}
        </div>

        {/* \u00c1rea de entrada */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Respuesta del estudiante:
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={6}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Ingresa aqu\u00ed la respuesta manuscrita del estudiante..."
          />
        </div>

        {/* Botones de acci\u00f3n */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleEvaluate}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Evaluar
          </button>
          <button
            onClick={handleExport}
            disabled={!isPro}
            title={!isPro ? 'Requiere plan PRO' : 'Exportar resultados'}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isPro ? 'Exportar' : 'Exportar (PRO)'}
          </button>
        </div>

        {/* CTA de suscripci\u00f3n */}
        {!isPro && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              \u00bfQuieres m\u00e1s funcionalidades?
            </h3>
            <p className="text-indigo-700 mb-4">
              Actualiza a PRO para exportar resultados, evaluaciones ilimitadas y m\u00e1s.
            </p>
            <button
              onClick={handleSubscribe}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Actualizar a PRO - $9,990/mes
            </button>
          </div>
        )}

        {isPro && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Plan PRO Activo
            </h3>
            <p className="text-green-700">
              Tienes acceso completo a todas las funciones de SAM v6.
            </p>
                        <button
              onClick={() => setIsPro(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Deshacer PRO (Test)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
