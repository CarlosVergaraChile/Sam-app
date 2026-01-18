'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface GeneratorState {
  prompt: string;
  contentType: string;
  subject: string;
  gradeLevel: string;
  objective: string;
  duration: string;
  activitiesCount: string;
  outputFormat: string;
  detailLevel: 'basic' | 'advanced' | 'premium';
  loading: boolean;
  generated: string | null;
  error: string | null;
  creditsRemaining: number | null;
}

export default function GeneratorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allowedTypes = ['lesson-plan', 'assessment', 'activity', 'homework', 'report', 'custom'];
  const initialType = (() => {
    const type = searchParams.get('type');
    return type && allowedTypes.includes(type) ? type : 'lesson-plan';
  })();

  const [state, setState] = useState<GeneratorState>({
    prompt: '',
    contentType: initialType,
    subject: 'Matemática',
    gradeLevel: '4° Básico',
    objective: '',
    duration: '45',
    activitiesCount: '3',
    outputFormat: 'bullets',
    detailLevel: 'advanced',
    loading: false,
    generated: null,
    error: null,
    creditsRemaining: null,
  });

  // Temporarily disabled auth check for testing
  // useEffect(() => {
  //   const session = localStorage.getItem('sam_session');
  //   if (!session) {
  //     router.push('/login');
  //   }
  // }, [router]);

  // Preseleccionar tipo según query (?type=assessment|activity|homework|report|lesson-plan|custom)
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && allowedTypes.includes(type)) {
      setState((prev) => ({ ...prev, contentType: type }));
    }
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const fullPrompt = `Actúa como asistente pedagógico para docentes de Chile y responde en español.
Tipo de contenido: ${state.contentType}
Asignatura: ${state.subject || 'General'}
Nivel/Grado: ${state.gradeLevel || 'No especificado'}
Objetivo/competencia: ${state.objective || 'No indicado'}
Duración estimada: ${state.duration || '45'} minutos
Nº de actividades: ${state.activitiesCount || '3'}
Formato deseado: ${state.outputFormat}
Nivel de detalle: ${state.detailLevel}
Indicaciones del docente: ${state.prompt || 'No indicó detalles adicionales'}

Estructura solicitada:
1) Objetivos de aprendizaje
2) Actividades paso a paso (claras y accionables)
3) Evaluación y retroalimentación
4) Materiales y recursos
5) Adaptaciones / diferenciación
6) Cierre y tarea (si aplica)
Usa viñetas y subtítulos claros.
Extensión: máximo 420 palabras, responde en un solo bloque, sin cortar el texto.
No generes sitios web, HTML ni varias páginas; entrega solo texto del informe/plan solicitado.
No agregues links ni navegación; mantén foco pedagógico y concreto.`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, mode: state.detailLevel }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo generar el contenido');
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
        error: err instanceof Error ? err.message : 'Ocurrió un error',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const contentTypeDescriptions: Record<string, string> = {
    'lesson-plan': 'Planificación completa con objetivos, actividades y evaluación',
    'assessment': 'Evaluación, prueba o rúbrica',
    'activity': 'Juego o actividad interactiva en clase',
    'homework': 'Tarea o guía para el hogar',
    'report': 'Informe administrativo o académico',
    'custom': 'Cualquier otro contenido educativo',
  };

  const subjects = [
    'Matemática',
    'Lenguaje y Comunicación',
    'Ciencias Naturales',
    'Historia y Ciencias Sociales',
    'Inglés',
    'Tecnología',
    'Artes Visuales',
    'Música',
    'Educación Física',
  ];

  const gradeLevels = [
    '1° Básico','2° Básico','3° Básico','4° Básico','5° Básico','6° Básico','7° Básico','8° Básico',
    'I Medio','II Medio','III Medio','IV Medio'
  ];

  const outputFormats = [
    { value: 'bullets', label: 'Viñetas' },
    { value: 'tabla', label: 'Tabla' },
    { value: 'pasos', label: 'Pasos numerados' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Generador para Docentes</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Crea planificaciones, evaluaciones, tareas y actividades en segundos</p>

      {state.error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {state.error}
        </div>
      )}

      {state.creditsRemaining !== null && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          Créditos restantes: <strong>{state.creditsRemaining}</strong>
        </div>
      )}

      <form onSubmit={handleGenerate} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tipo de contenido *</label>
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
            <option value="lesson-plan">📋 Planificación de clase</option>
            <option value="assessment">✅ Evaluación / Rúbrica</option>
            <option value="activity">🎮 Actividad / Juego</option>
            <option value="homework">📝 Tarea para la casa</option>
            <option value="report">📊 Informe / Analítica</option>
            <option value="custom">✨ Contenido personalizado</option>
          </select>
          <small style={{ color: '#666' }}>{contentTypeDescriptions[state.contentType]}</small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Asignatura *</label>
            <select
              value={state.subject}
              onChange={(e) => setState(prev => ({ ...prev, subject: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nivel / Grado *</label>
            <select
              value={state.gradeLevel}
              onChange={(e) => setState(prev => ({ ...prev, gradeLevel: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            >
              {gradeLevels.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Objetivo / competencia</label>
            <input
              type="text"
              placeholder="Ej: Sumar y restar fracciones con igual denominador"
              value={state.objective}
              onChange={(e) => setState(prev => ({ ...prev, objective: e.target.value }))}
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Duración (minutos)</label>
            <input
              type="number"
              min="20"
              max="120"
              value={state.duration}
              onChange={(e) => setState(prev => ({ ...prev, duration: e.target.value }))}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nº de actividades</label>
            <input
              type="number"
              min="1"
              max="8"
              value={state.activitiesCount}
              onChange={(e) => setState(prev => ({ ...prev, activitiesCount: e.target.value }))}
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Formato de salida</label>
            <select
              value={state.outputFormat}
              onChange={(e) => setState(prev => ({ ...prev, outputFormat: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            >
              {outputFormats.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Indicaciones del docente *</label>
          <textarea
            placeholder="Ej: Enfatiza ejemplos concretos, incluye trabajo colaborativo y una breve reflexión final."
            value={state.prompt}
            onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nivel de detalle</label>
          <select
            value={state.detailLevel}
            onChange={(e) => setState(prev => ({ ...prev, detailLevel: e.target.value as GeneratorState['detailLevel'] }))}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
          >
            <option value="basic">Básico (rápido)</option>
            <option value="advanced">Avanzado (recomendado)</option>
            <option value="premium">Premium (más detalle)</option>
          </select>
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
          {state.loading ? 'Generando...' : '✨ Generar contenido'}
        </button>
      </form>

        {state.generated && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>Contenido generado</h2>
            <button
              onClick={() => {
                const text = state.generated;
                navigator.clipboard.writeText(text || '');
                alert('Copiado al portapapeles');
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
              📋 Copiar
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
