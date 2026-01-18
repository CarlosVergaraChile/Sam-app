'use client';

import { useState, useEffect } from 'react';

export default function TestLLMPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testPrompt, setTestPrompt] = useState('Escribe un breve saludo para un docente chileno');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch('/api/test-llm')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setStatus({ error: err.message });
        setLoading(false);
      });
  }, []);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const res = await fetch('/api/test-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt }),
      });
      
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>🧪 Test de LLM - SAM</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Prueba la conexión con proveedores de IA sin autenticación
      </p>

      {loading ? (
        <p>Cargando estado...</p>
      ) : (
        <>
          <div style={{
            backgroundColor: status?.llmAvailable ? '#d1fae5' : '#fee2e2',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
          }}>
            <h2 style={{ marginTop: 0 }}>Estado de proveedores</h2>
            <p><strong>Estado:</strong> {status?.llmAvailable ? '✅ Al menos un proveedor configurado' : '❌ Ningún proveedor configurado'}</p>
            <p><strong>Timestamp:</strong> {status?.timestamp}</p>
            
            <h3>Proveedores disponibles:</h3>
            <ul>
              <li>Gemini: {status?.providers?.gemini ? '✅ Configurado' : '❌ No configurado'}</li>
              <li>OpenAI: {status?.providers?.openai ? '✅ Configurado' : '❌ No configurado'}</li>
              <li>DeepSeek: {status?.providers?.deepseek ? '✅ Configurado' : '❌ No configurado'}</li>
              <li>Anthropic: {status?.providers?.anthropic ? '✅ Configurado' : '❌ No configurado'}</li>
              <li>Perplexity: {status?.providers?.perplexity ? '✅ Configurado' : '❌ No configurado'}</li>
            </ul>

            {!status?.llmAvailable && (
              <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.375rem',
                marginTop: '1rem',
              }}>
                <p style={{ fontWeight: 'bold', marginTop: 0 }}>
                  Para activar un proveedor, agrega una de estas variables de entorno:
                </p>
                <pre style={{
                  backgroundColor: '#f3f4f6',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  overflowX: 'auto',
                }}>
{`# Gemini (recomendado para empezar)
LLM_API_KEY_GEMINI=tu_key_aqui
# o
GOOGLE_API_KEY=tu_key_aqui

# OpenAI
LLM_API_KEY_OPENAI=tu_key_aqui
# o
OPENAI_API_KEY=tu_key_aqui`}
                </pre>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                  Obtén tu Gemini API key gratis en: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Google AI Studio</a>
                </p>
              </div>
            )}
          </div>

          {status?.llmAvailable && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
              <h2 style={{ marginTop: 0 }}>Probar generación</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Prompt de prueba:
                </label>
                <textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                onClick={handleTest}
                disabled={testing}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: testing ? '#ccc' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: testing ? 'not-allowed' : 'pointer',
                }}
              >
                {testing ? 'Generando...' : '🚀 Probar ahora'}
              </button>
            </div>
          )}

          {testResult && (
            <div style={{
              backgroundColor: testResult.success ? 'white' : '#fee2e2',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{ marginTop: 0 }}>
                {testResult.success ? '✅ Resultado' : '❌ Error'}
              </h2>

              {testResult.success ? (
                <>
                  <p><strong>Proveedor usado:</strong> {testResult.provider}</p>
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    marginTop: '1rem',
                  }}>
                    <pre style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      margin: 0,
                    }}>
                      {testResult.material}
                    </pre>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Error:</strong> {testResult.error}</p>
                  {testResult.details && (
                    <pre style={{
                      backgroundColor: '#f3f4f6',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      overflowX: 'auto',
                      marginTop: '1rem',
                    }}>
                      {testResult.details}
                    </pre>
                  )}
                  {testResult.hint && (
                    <p style={{ color: '#991b1b', marginTop: '1rem' }}>
                      💡 {testResult.hint}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
      }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ Información</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Este endpoint <strong>NO requiere autenticación</strong> para facilitar pruebas</li>
          <li>En desarrollo local: agrega las keys en <code>.env.local</code></li>
          <li>En Vercel: agrega las keys en Settings → Environment Variables</li>
          <li>La API key de Gemini es gratuita con límites generosos</li>
        </ul>
      </div>
    </div>
  );
}
