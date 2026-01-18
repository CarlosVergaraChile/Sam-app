export default function Home() {
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
      <section style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>SAM - Asistente IA para Docentes</h2>
        <p style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '2rem' }}>Genera planificaciones, evaluaciones, actividades y reportes administrativos con IA</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/login" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>Comenzar</a>
          <a href="/dashboard" style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>Probar demo</a>
        </div>
      </section>
      
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📋 Planificación de clases</h3>
          <p style={{ color: '#374151' }}>Crea planificaciones completas en minutos. Describe lo que necesitas y la IA se encarga del resto.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>✅ Evaluaciones</h3>
          <p style={{ color: '#374151' }}>Genera pruebas, rúbricas y criterios de evaluación alineados con el currículum.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🎮 Actividades interactivas</h3>
          <p style={{ color: '#374151' }}>Crea juegos y dinámicas grupales para aumentar la participación de tus estudiantes.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📝 Tareas y guías</h3>
          <p style={{ color: '#374151' }}>Genera tareas, guías y listas de actividades listas para usar.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📊 Reportes administrativos</h3>
          <p style={{ color: '#374151' }}>Crea informes para directivos, cobertura curricular y analíticas de aprendizaje.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>✨ Generador flexible</h3>
          <p style={{ color: '#374151' }}>¿Necesitas algo distinto? Usa el generador personalizado para cualquier contenido educativo.</p>
        </div>
      </section>
      
      <section style={{ backgroundColor: '#eff6ff', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ahorra horas en planificación y gestión</h3>
        <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '1.5rem' }}>Únete a docentes que usan SAM para preparar clases y enfocarse en lo importante: el aprendizaje.</p>
        <a href="/login" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none', fontSize: '1.125rem', fontWeight: '600' }}>Probar gratis</a>
      </section>
    </div>
  );
}
