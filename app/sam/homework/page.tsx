'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeworkPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sam/generator?type=homework');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Loading Homework Generator...</p>
    </div>
  );
}
