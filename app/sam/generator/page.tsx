'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GeneratorState {
  prompt: string;
  contentType: string;
  subject: string;
  gradeLevel: string;
  loading: boolean;
  generated: string | null;
  error: string | null;
  creditsRemaining: number | null;
}

export default function GeneratorPage() {
  const [state, setState] = useState<GeneratorState>({
    prompt: '',
    contentType: 'lesson-plan',
    subject: '',
    gradeLevel: '',
    loading: false,
    generated: null,
    error: null,
    creditsRemaining: null,
  });

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/features/generador');
        if (res.status === 401) {
          router.push('/login');
        } else if (res.ok) {
          const data = await res.json();
          if (!data.isEnabled) {
            setState(prev => ({ ...prev, error: 'Generador feature is not enabled for your account' }));
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };
    checkAuth();
  }, [router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const fullPrompt = `Content Type: ${state.contentType.toUpperCase()}
Subject: ${state.subject || 'General'}
Grade Level: ${state.gradeLevel || 'Not specified'}
Request: ${state.prompt}`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setState(prev => ({
        ...prev,
        generated: data.material,
        creditsRemaining: data.creditsRemaining,
        prompt: '',
        error: null,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const contentTypeDescriptions: Record<string, string> = {
    'lesson-plan': 'Complete lesson plan with objectives, activities, and assessment',
    'assessment': 'Quiz, exam, or assessment rubric',
    'activity': 'Interactive game or classroom activity',
    'homework': 'Homework assignment or worksheet',
    'report': 'Administrative or academic report',
    'custom': 'Any custom content you need',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content Generator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Use AI to generate educational content in seconds</p>

      {state.error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {state.error}
        </div>
      )}

      {state.creditsRemaining !== null && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          Credits remaining: <strong>{state.creditsRemaining}</strong>
        </div>
      )}

      <form onSubmit={handleGenerate} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Content Type *</label>
          <select
            value={state.contentType}
            onChange={(e) => setState(prev => ({ ...prev, contentType: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
          >
            <option value="lesson-plan">📋 Lesson Plan</option>
            <option value="assessment">✅ Assessment</option>
            <option value="activity">🎮 Game & Activity</option>
            <option value="homework">📝 Homework & Tasks</option>
            <option value="report">📊 Report & Analytics</option>
            <option value="custom">✨ Custom Content</option>
          </select>
          <small style={{ color: '#666' }}>{contentTypeDescriptions[state.contentType]}</small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subject</label>
            <input
              type="text"
              placeholder="e.g., Mathematics, History, English"
              value={state.subject}
              onChange={(e) => setState(prev => ({ ...prev, subject: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Grade Level</label>
            <input
              type="text"
              placeholder="e.g., 3rd Grade, High School"
              value={state.gradeLevel}
              onChange={(e) => setState(prev => ({ ...prev, gradeLevel: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Request *</label>
          <textarea
            placeholder="Describe what you need. Be specific about topics, requirements, and style."
            value={state.prompt}
            onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
            required
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={state.loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: state.loading ? '#ccc' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: state.loading ? 'not-allowed' : 'pointer',
          }}
        >
          {state.loading ? 'Generating...' : '✨ Generate Content'}
        </button>
      </form>

      {state.generated && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>Generated Content</h2>
            <button
              onClick={() => {
                const text = state.generated;
                navigator.clipboard.writeText(text || '');
                alert('Copied to clipboard!');
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              📋 Copy
            </button>
          </div>
          <pre style={{
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}>
            {state.generated}
          </pre>
        </div>
      )}
    </div>
  );
}
