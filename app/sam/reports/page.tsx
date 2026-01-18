'use client';

import { useState } from 'react';

type ReportType = 'cobertura' | 'diagnostico' | 'evaluaciones' | 'dificultades' | 'competencias';

interface ReportState {
  reportType: ReportType;
  asignatura: string;
  curso: string;
  periodo: string;
  fechaInicio: string;
  fechaTermino: string;
  datosAdicionales: string;
  loading: boolean;
  generated: string | null;
  error: string | null;
}

const reportTypes = {
  cobertura: {
    label: '📋 Informe de Cobertura Curricular',
    description: 'Detalle de OA (Objetivos de Aprendizaje) cubiertos vs pendientes',
    fields: ['asignatura', 'curso', 'periodo', 'datosAdicionales'],
    placeholder: 'Ej: OA 1, 2, 4 cubiertos; OA 3, 5 pendientes para próxima semana',
  },
  diagnostico: {
    label: '🔍 Informe de Diagnóstico Inicial',
    description: 'Estado inicial de aprendizajes de estudiantes',
    fields: ['asignatura', 'curso', 'fechaInicio', 'datosAdicionales'],
    placeholder: 'Ej: 60% comprende multiplicación, 40% requiere refuerzo en división',
  },
  evaluaciones: {
    label: '✅ Informe de Resultados de Evaluaciones',
    description: 'Análisis de resultados de pruebas y actividades',
    fields: ['asignatura', 'curso', 'periodo', 'datosAdicionales'],
    placeholder: 'Ej: Promedio 6.2, 70% aprobó, 30% bajo promedio de 4.5',
  },
  dificultades: {
    label: '⚠️ Informe de Estudiantes con Dificultades',
    description: 'Identificación y análisis de estudiantes con NEE o rezago',
    fields: ['asignatura', 'curso', 'periodo', 'datosAdicionales'],
    placeholder: 'Ej: 5 estudiantes con dificultad severa, 8 con moderada, necesitan refuerzo',
  },
  competencias: {
    label: '🎯 Informe de Desarrollo de Competencias',
    description: 'Evaluación de competencias transversales y disciplinarias',
    fields: ['asignatura', 'curso', 'periodo', 'datosAdicionales'],
    placeholder: 'Ej: Resolución de problemas 70%, Argumentación 65%, Representación 75%',
  },
};

export default function ReportsPage() {
  const [state, setState] = useState<ReportState>({
    reportType: 'cobertura',
    asignatura: 'Matemática',
    curso: '4° Básico',
    periodo: '1° Semestre 2026',
    fechaInicio: '',
    fechaTermino: '',
    datosAdicionales: '',
    loading: false,
    generated: null,
    error: null,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const reportConfig = reportTypes[state.reportType];
      
      let prompt = `Actúa como especialista en evaluación pedagógica UTP (Unidad Técnica Pedagógica) chilena.
Genera un informe profesional en español, estructurado y listo para entregar a directivos.

Tipo de Informe: ${reportConfig.label}
Descripción: ${reportConfig.description}
Asignatura: ${state.asignatura || 'No indicada'}
Curso: ${state.curso || 'No indicado'}
Período: ${state.periodo || 'No indicado'}
${state.fechaInicio ? `Fecha de Inicio: ${state.fechaInicio}` : ''}
${state.fechaTermino ? `Fecha de Término: ${state.fechaTermino}` : ''}
Datos Adicionales / Observaciones:
${state.datosAdicionales || 'Sin datos adicionales'}

ESTRUCTURA DEL INFORME:
1. Encabezado: Título, asignatura, curso, período, fecha de elaboración
2. Resumen Ejecutivo: 3-4 líneas de hallazgos clave
3. Análisis Detallado: Según el tipo de informe (cobertura, diagnóstico, etc.)
4. Recomendaciones: Acciones concretas para mejorar
5. Conclusiones: Síntesis final

Genera el informe profesional, formal, orientado a directivos y UTP.`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          mode: 'advanced',
          reportType: state.reportType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo generar el informe');
      }

      setState(prev => ({
        ...prev,
        generated: data.material,
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

  const currentConfig = reportTypes[state.reportType];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Generador de Informes para UTP</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Crea informes pedagógicos profesionales por asignatura y curso
      </p>

      {state.error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {state.error}
        </div>
      )}

      <form onSubmit={handleGenerate} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        {/* Tipo de Informe */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tipo de Informe *</label>
          <select
            value={state.reportType}
            onChange={(e) => setState(prev => ({ ...prev, reportType: e.target.value as ReportType }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
          >
            {Object.entries(reportTypes).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>{currentConfig.description}</small>
        </div>

        {/* Asignatura */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Asignatura *</label>
            <select
              value={state.asignatura}
              onChange={(e) => setState(prev => ({ ...prev, asignatura: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            >
              <option>Matemática</option>
              <option>Lenguaje y Comunicación</option>
              <option>Ciencias Naturales</option>
              <option>Historia y Ciencias Sociales</option>
              <option>Inglés</option>
              <option>Tecnología</option>
              <option>Artes Visuales</option>
              <option>Música</option>
              <option>Educación Física</option>
            </select>
          </div>

          {/* Curso */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Curso *</label>
            <select
              value={state.curso}
              onChange={(e) => setState(prev => ({ ...prev, curso: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            >
              {['1° Básico', '2° Básico', '3° Básico', '4° Básico', '5° Básico', '6° Básico', '7° Básico', '8° Básico', 'I Medio', 'II Medio', 'III Medio', 'IV Medio'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Período y Fechas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Período *</label>
            <select
              value={state.periodo}
              onChange={(e) => setState(prev => ({ ...prev, periodo: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            >
              <option>1° Semestre 2026</option>
              <option>2° Semestre 2026</option>
              <option>Anual 2026</option>
              <option>Otro (especificar abajo)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Fecha Inicio (opcional)</label>
            <input
              type="date"
              value={state.fechaInicio}
              onChange={(e) => setState(prev => ({ ...prev, fechaInicio: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Fecha Término (opcional)</label>
            <input
              type="date"
              value={state.fechaTermino}
              onChange={(e) => setState(prev => ({ ...prev, fechaTermino: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            />
          </div>
        </div>

        {/* Datos Adicionales */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Datos Adicionales *</label>
          <textarea
            placeholder={currentConfig.placeholder}
            value={state.datosAdicionales}
            onChange={(e) => setState(prev => ({ ...prev, datosAdicionales: e.target.value }))}
            required
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
            Ingresa datos clave, observaciones o resultados específicos que quieras incluir en el informe
          </small>
        </div>

        {/* Botón Generar */}
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
          {state.loading ? 'Generando informe...' : '📄 Generar Informe'}
        </button>
      </form>

      {/* Informe Generado */}
      {state.generated && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>Informe Generado</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(state.generated || '');
                alert('Informe copiado al portapapeles');
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
          <div
            style={{
              backgroundColor: '#f3f4f6',
              padding: '1.5rem',
              borderRadius: '0.375rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontSize: '0.95rem',
              lineHeight: '1.6',
            }}
          >
            {state.generated}
          </div>
        </div>
      )}
    </div>
  );
}
