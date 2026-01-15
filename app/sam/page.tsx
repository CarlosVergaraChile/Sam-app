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
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to check feature',
        }));
      }
    };
    checkFeature();
  }, []);

  // Handle generate
  const handleGenerate = async () => {
    setState((prev) => ({ ...prev, generating: true, error: null }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.input }),
      });

      if (!res.ok) {
        const error = await res.json();
        setState((prev) => ({
          ...prev,
          generating: false,
          error: error.error || 'Generation failed',
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
    } catch (err) {
      setState((prev) => ({
        ...prev,
        generating: false,
        error: 'Network error',
      }));
    }
  };

  if (state.loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>SAM v6 - Generador</h1>
      {state.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{state.error}</div>
      )}
      {state.isEnabled ? (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={state.input}
              onChange={(e) =>
                setState((prev) => ({ ...prev, input: e.target.value }))
              }
              placeholder="Enter your prompt..."
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
            {state.generating ? 'Generating...' : 'Generate'}
          </button>
          {state.material && (
            <div
              style={{
                marginTop: '20px',
                padding: '10px',
                border: '1px solid #ccc',
              }}
            >
              <h3>Generated Material:</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{state.material}</pre>
              <p>
                Credits remaining:{' '}
                <strong>{state.creditsRemaining}</strong>
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Generador feature is not enabled for your account.</p>
      )}
    </div>
  );
}
