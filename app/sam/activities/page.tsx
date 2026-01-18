'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivitiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sam/generator?type=activity');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Cargando generador de actividades...</p>
    </div>
  );
}
