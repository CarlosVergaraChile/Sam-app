'use client';

export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '80rem', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Welcome to SAM</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Your AI assistant for creating lesson materials and administrative reports</p>
      
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
          <h3 style={{ marginTop: 0, color: '#2563eb' }}>📋 Lesson Plans</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Generate complete lesson plans for your classes</p>
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
          <h3 style={{ marginTop: 0, color: '#16a34a' }}>✅ Assessments</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Create quizzes, exams, and evaluation rubrics</p>
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
          <h3 style={{ marginTop: 0, color: '#d97706' }}>🎮 Games & Activities</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Generate engaging games and interactive activities</p>
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
          <h3 style={{ marginTop: 0, color: '#7c3aed' }}>📝 Homework & Tasks</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Create homework assignments and task lists</p>
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
          <h3 style={{ marginTop: 0, color: '#dc2626' }}>📊 Reports & Analytics</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Generate administrative and academic reports</p>
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
          <h3 style={{ marginTop: 0, color: '#0891b2' }}>✨ Custom Generator</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Use AI to generate any type of content you need</p>
        </a>
      </div>

      <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #2563eb' }}>
        <h3 style={{ marginTop: 0 }}>💡 Tips</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e40af' }}>
          <li>Use SAM to save time on planning and administrative tasks</li>
          <li>Customize all generated content to match your teaching style</li>
          <li>Check your credit balance before generating large reports</li>
        </ul>
      </div>
    </div>
  );
}
