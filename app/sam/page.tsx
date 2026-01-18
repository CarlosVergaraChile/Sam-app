'use client';
import { useState, useEffect } from 'react';

interface GeneratorState {
  isEnabled: boolean;
  loading: boolean;
  material: string | null;
  creditsRemaining: number | null;
  input: string;
  generating: boolean;
  error: string | null;
  mode: string;
  history: any[];
}

export default function SamPage() {
  const [state, setState] = useState<GeneratorState>({
    isEnabled: false,
    loading: true,
    material: null,
    creditsRemaining: null,
    input: '',
    generating: false,
    error: null,
    mode: 'basic',
    history: [],
  });

  // Check feature flag on mount
  useEffect(() => {
    const checkFeature = async () => {
      try {
        const res = await fetch('/api/features/generador');
        const data = await res.json();
        setState((prev) => ({
          ...prev,
          isEnabled: data.isEnabled || false,
          loading: false,
        }));
        if (data.isEnabled) {
          fetchHistory();
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'No se pudo verificar el generador',
        }));
      }
    };
    checkFeature();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/generate/history');
      if (res.ok) {
        const data = await res.json();
        setState((prev) => ({ ...prev, history: data.materials || [] }));
      }
    } catch (err) {
      console.error('History fetch error:', err);
    }
  };

  // Handle generate
  const handleGenerate = async () => {
    setState((prev) => ({ ...prev, generating: true, error: null }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.input, mode: state.mode }),
      });
      if (!res.ok) {
        const error = await res.json();
        setState((prev) => ({
          ...prev,
          generating: false,
          error: error.error || 'Falló la generación',
        }));
        return;
      }
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        material: data.material,
        creditsRemaining: data.creditsRemaining,
        generating: false,
      }));
      fetchHistory();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        generating: false,
        error: 'Error de red',
      }));
    }
  };

  if (state.loading) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>SAM v6 - Generador</h1>
      {state.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{state.error}</div>
      )}
      {state.isEnabled ? (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label>Modo: </label>
            <select
              value={state.mode}
              onChange={(e) =>
                setState((prev) => ({ ...prev, mode: e.target.value }))
              }
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="basic">Básico (1 crédito)</option>
              <option value="advanced">Avanzado (2 créditos)</option>
              <option value="premium">Premium (3 créditos)</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={state.input}
              onChange={(e) =>
                setState((prev) => ({ ...prev, input: e.target.value }))
              }
              placeholder="Ingresa tu solicitud..."
              style={{
                width: '100%',
                height: '100px',
                fontFamily: 'monospace',
              }}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={state.generating}
            style={{
              padding: '10px 20px',
              cursor: state.generating ? 'not-allowed' : 'pointer',
            }}
          >
            {state.generating ? 'Generando...' : 'Generar'}
          </button>
          {state.material && (
            <div
              style={{
                marginTop: '20px',
                padding: '10px',
                border: '1px solid #ccc',
              }}
            >
              <h3>Contenido generado:</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{state.material}</pre>
              <p>
                Créditos restantes: <strong>{state.creditsRemaining}</strong>
              </p>
            </div>
          )}
          {state.history.length > 0 && (
            <div
              style={{
                marginTop: '20px',
                padding: '10px',
                border: '1px solid #ddd',
              }}
            >
              <h3>Historial ({state.history.length})</h3>
              {state.history.map((item: any) => (
                <div key={item.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  <small style={{ color: '#666' }}>
                    {new Date(item.created_at).toLocaleString()} [{item.mode}]
                  </small>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    {item.material?.substring(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>El generador no está habilitado para tu cuenta.</p>
      )}
    </div>
  );
}
