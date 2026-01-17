'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

export default function AuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          throw new Error('Configuración de Supabase ausente');
        }

        // The hash fragment (after #) contains the session token
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        
        if (!hash) {
          // Try to get code from query params (standard OAuth flow)
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
          }
        }

        // Redirect to dashboard
        setTimeout(() => router.push('/dashboard'), 1000);
      } catch (error) {
        console.error('Auth callback error:', error);
        // Redirect to login with error message
        setTimeout(() => router.push('/login?error=auth_failed'), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '18px',
        color: '#666',
      }}>
        <p>Procesando confirmación de email...</p>
        <p style={{ fontSize: '14px', marginTop: '10px', color: '#999' }}>
          Por favor espera
        </p>
      </div>
    </div>
  );
}
