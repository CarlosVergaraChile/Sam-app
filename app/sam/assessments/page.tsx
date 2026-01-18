'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sam/generator?type=assessment');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Cargando generador de evaluaciones...</p>
    </div>
  );
}
