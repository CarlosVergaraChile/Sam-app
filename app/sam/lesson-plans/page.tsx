'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LessonPlansPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to generator with lesson-plan preset
    router.push('/sam/generator?type=lesson-plan');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Cargando generador de planificaciones...</p>
    </div>
  );
}
