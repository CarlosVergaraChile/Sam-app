import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAM v6 - Handwritten Response Evaluation',
  description: 'Automatic evaluation of handwritten student responses with OCR and AI feedback',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>SAM v6</h1>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="/" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Home</a>
                <a href="/login" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Login</a>
                <a href="/dashboard" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Dashboard</a>
              </div>
            </div>
          </nav>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <footer className="bg-gray-200 p-4 text-center text-gray-600">
            <p>&copy; 2026 SAM v6. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
