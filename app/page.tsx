export default function Home() {
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
      <section style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>SAM v6</h2>
        <p style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '2rem' }}>Automatic evaluation of handwritten student responses</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/login" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>Login</a>
          <a href="/dashboard" style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>Try Demo</a>
        </div>
      </section>
      
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>OCR Recognition</h3>
          <p style={{ color: '#374151' }}>Advanced optical character recognition for handwritten responses.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>AI Feedback</h3>
          <p style={{ color: '#374151' }}>Intelligent feedback based on curriculum standards.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Real-time Evaluation</h3>
          <p style={{ color: '#374151' }}>Instant evaluation and scoring of student work.</p>
        </div>
      </section>
      
      <section style={{ backgroundColor: '#eff6ff', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to get started?</h3>
        <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '1.5rem' }}>Join thousands of educators using SAM v6 to streamline student evaluation.</p>
        <a href="/login" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none', fontSize: '1.125rem', fontWeight: '600' }}>Start Now</a>
      </section>
    </div>
  );
}
