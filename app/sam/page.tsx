'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LS_KEY = 'sam_is_pro';

// Sanitizar HTML para evitar romper export DOC
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function SamPageContent() {
  const [isPro, setIsPro] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
    const [pricing, setPricing] = useState<{activePrice: string, label: string, endsAt: string, isActive: boolean} | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [responseText, setResponseText] = useState('');
  const [printMode, setPrintMode] = useState(false);
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

    // Fetch pricing on mount
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error('[SAM][pricing] error:', err));
  }, []);

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

      // Fetch pricing info on mount
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error('[SAM][pricing] Error:', err));
  }, []);
  }, [searchParams, router]);

  const handleEvaluate = () => {
    if (!responseText.trim()) {
      setErrorMessage('Por favor ingresa una respuesta para evaluar');
      return;
    }
        setErrorMessage('');
    alert('Evaluación simulada: ' + responseText.substring(0, 50));
  };

  const handleExport = () => {
    if (!responseText.trim()) {
      setErrorMessage('No hay contenido para exportar');
      return;
    }
        setErrorMessage('');

    // Generar timestamp y slug
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const slug = responseText.trim().substring(0, 20).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const baseFilename = `SAM_${dateStr}_${slug}`;

    // 1. Descargar TXT
    const txtBlob = new Blob([responseText], { type: 'text/plain;charset=utf-8' });
    const txtUrl = URL.createObjectURL(txtBlob);
    const txtLink = document.createElement('a');
    txtLink.href = txtUrl;
    txtLink.download = `${baseFilename}.txt`;
    document.body.appendChild(txtLink);
    txtLink.click();
    document.body.removeChild(txtLink);
    URL.revokeObjectURL(txtUrl);

    // 2. Descargar DOC (HTML compatible con Word)
    const docHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>SAM Evaluation Export</title>
      </head>
      <body>
        <h1>SAM v6 - Evaluación de Respuesta</h1>
        <p><strong>Fecha:</strong> ${now.toLocaleDateString('es-CL')}</p>
        <hr>
        <pre>${escapeHtml(responseText)}</pre>
      </body>
      </html>
    `;

    const docBlob = new Blob([docHtml], { type: 'application/msword' });
    const docUrl = URL.createObjectURL(docBlob);
    const docLink = document.createElement('a');
    docLink.href = docUrl;
    docLink.download = `${baseFilename}.doc`;
    document.body.appendChild(docLink);
    docLink.click();
    document.body.removeChild(docLink);
    URL.revokeObjectURL(docUrl);
  };

  const handlePrintPdf = () => {
    if (!responseText.trim()) {
      setErrorMessage('No hay contenido para exportar');
      return;
    }

    setErrorMessage('');
    setPrintMode(true);

    // Configurar handler de después de imprimir
    const afterPrint = () => {
      setPrintMode(false);
      window.removeEventListener('afterprint', afterPrint);
    };
    window.addEventListener('afterprint', afterPrint);

    // Esperar 1 tick para que el DOM se actualice, luego imprimir
    setTimeout(() => {
      try {
        window.print();
      } catch (error) {
              console.error('[SAM][print] error:', error);
        setErrorMessage('No se pudo abrir la impresión. Revisa el bloqueador del navegador.');
        setPrintMode(false);
      }

      // Fallback: volver al modo normal después de 1s si afterprint no dispara
      setTimeout(() => {
        setPrintMode(false);
        window.removeEventListener('afterprint', afterPrint);
      }, 1000);
    }, 80);
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: pricing?.activePrice || 'price_1SpIBTAaDeOcsC00GasIgBeN'' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('[SAM][checkout] error:', error);
    }
  };

  // Modo impresión: renderizar solo contenido imprimible
  if (printMode) {
    return (
      <div className="sam-print" style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1>SAM v6 - Evaluación de Respuesta</h1>
        <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-CL')}</p>
        <hr />
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {responseText}
        </pre>
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body > *:not(.sam-print) {
              display: none !important;
            }
            .sam-print {
              display: block !important;
            }
            pre {
              white-space: pre-wrap !important;
              word-break: break-word !important;
            }
          }
        `}} />
      </div>
    );
  }

  // Modo normal: UI completa
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Banner de éxito (solo en memoria) */}
{showBanner && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">
            ¡Suscripción exitosa! Ahora tienes acceso a todas las funciones PRO.
          </span>
          <button
            type="button"
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setShowBanner(false)}
            aria-label="Cerrar"
          >
            ✕
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
              ✓ Plan PRO Activo
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Plan Free
            </span>
          )}
        </div>

        {/* Área de entrada */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Respuesta del estudiante:
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={6}
            value={responseText}
              onChange={(e) => { setResponseText(e.target.value); setErrorMessage(''); }}            placeholder="Ingresa aquí la respuesta manuscrita del estudiante..."
          />
        </div>

        {/* Botones de acción */}
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
          {isPro && (
            <button
              onClick={handlePrintPdf}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              🖨️ Imprimir / PDF
            </button>
          )}
        </div>

        {/* Mensaje de error de exportación */}
        {errorMessage && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{errorMessage}</span>
            <button
              type="button"
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMessage('')}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        )}

        {/* CTA de suscripción */}
{/* PRICING EARLY BIRD */}
      {!isPro && (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="text-center">
            <div className="inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold mb-5 animate-pulse">
              ⚡ PRECIO FUNDADORES — Solo hasta 28 de febrero
            </div>
            
            <div className="text-8xl font-black text-gray-900 mb-1">
              $7.990
            </div>
            <div className="text-2xl text-gray-600 mb-5">CLP/mes</div>
            
            <div {pricing?.isActive
              ? `$${pricing.activePrice.toLocaleString('es-CL')}`
              : '$9.990'}
