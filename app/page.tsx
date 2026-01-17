export default function Home() {
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
      <section style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>SAM - Teacher's AI Assistant</h2>
        <p style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '2rem' }}>Generate lesson plans, assessments, activities, and administrative reports powered by AI</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/login" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>Get Started</a>
          <a href="/dashboard" style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>Try Demo</a>
        </div>
      </section>
      
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📋 Lesson Planning</h3>
          <p style={{ color: '#374151' }}>Create complete lesson plans in minutes. Just describe what you want to teach and let AI do the heavy lifting.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>✅ Assessments</h3>
          <p style={{ color: '#374151' }}>Generate quizzes, exams, rubrics, and evaluation criteria aligned with curriculum standards.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🎮 Interactive Activities</h3>
          <p style={{ color: '#374151' }}>Create engaging games, group activities, and interactive exercises to boost student engagement.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📝 Homework & Tasks</h3>
          <p style={{ color: '#374151' }}>Generate homework assignments, task lists, and student worksheets instantly.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📊 Administrative Reports</h3>
          <p style={{ color: '#374151' }}>Generate reports for administrators, curriculum coverage reports, and learning outcome analytics.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>✨ Flexible Generator</h3>
          <p style={{ color: '#374151' }}>Need something else? Use our custom generator to create any type of educational content you need.</p>
        </div>
      </section>
      
      <section style={{ backgroundColor: '#eff6ff', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Save Hours on Planning & Administration</h3>
        <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '1.5rem' }}>Join educators using SAM to streamline lesson preparation and focus on what matters: student learning.</p>
        <a href="/login" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none', fontSize: '1.125rem', fontWeight: '600' }}>Start Free Trial</a>
      </section>
    </div>
  );
}
