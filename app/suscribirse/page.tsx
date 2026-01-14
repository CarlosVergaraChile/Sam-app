'use client';

import { useState } from 'react';

export default function SuscribirsePage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Suscripción SAM v6</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Evaluación automática de respuestas manuscritas
      </p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: '20px 40px',
          fontSize: '20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Procesando...' : 'Pagar USD 9.99 / mes'}
      </button>
    </div>
  );
}
