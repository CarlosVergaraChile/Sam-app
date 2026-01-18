'use client';

export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '80rem', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Bienvenido/a a SAM</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Tu asistente IA para crear material de clases y reportes administrativos</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <a href="/sam/lesson-plans" style={{
          display: 'block',
          padding: '2rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
          <h3 style={{ marginTop: 0, color: '#2563eb' }}>📋 Planificaciones</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Genera planificaciones completas para tus clases</p>
        </a>

        <a href="/sam/assessments" style={{
          display: 'block',
          padding: '2rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
          <h3 style={{ marginTop: 0, color: '#16a34a' }}>✅ Evaluaciones</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Crea pruebas, exámenes y rúbricas de evaluación</p>
        </a>

        <a href="/sam/activities" style={{
          display: 'block',
          padding: '2rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
          <h3 style={{ marginTop: 0, color: '#d97706' }}>🎮 Juegos y actividades</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Genera juegos y actividades interactivas</p>
        </a>

        <a href="/sam/homework" style={{
          display: 'block',
          padding: '2rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
          <h3 style={{ marginTop: 0, color: '#7c3aed' }}>📝 Tareas</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Crea tareas y listas de actividades</p>
        </a>

        <a href="/sam/reports" style={{
          display: 'block',
          padding: '2rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
          <h3 style={{ marginTop: 0, color: '#dc2626' }}>📊 Reportes y analíticas</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Genera reportes administrativos y académicos</p>
        </a>

        <a href="/sam/generator" style={{
          display: 'block',
          padding: '2rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}>
            <h3 style={{ marginTop: 0, color: '#0891b2' }}>✨ Generador libre</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Usa IA para generar cualquier contenido que necesites</p>
        </a>
      </div>

      <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #2563eb' }}>
        <h3 style={{ marginTop: 0 }}>💡 Consejos</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e40af' }}>
          <li>Usa SAM para ahorrar tiempo en planificación y gestiones</li>
          <li>Ajusta el contenido generado a tu estilo de enseñanza</li>
          <li>Revisa tus créditos antes de generar reportes extensos</li>
        </ul>
      </div>
    </div>
  );
}
