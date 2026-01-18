import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAM v6 - Evaluación asistida por IA (ES/EN)',
  description: 'Evaluación automática de respuestas manuscritas con OCR e IA (ES/EN) / AI-powered handwritten response evaluation',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.svg" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>SAM v6</h1>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="/" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Inicio</a>
                <a href="/login" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Ingresar</a>
                <a href="/dashboard" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', textDecoration: 'none', color: 'white' }}>Panel</a>
              </div>
            </div>
          </nav>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <footer className="bg-gray-200 p-4 text-center text-gray-600">
            <p>&copy; 2026 SAM v6. Todos los derechos reservados / All rights reserved.</p>
          </footer>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }`,
          }}
        />
      </body>
    </html>
  );
}
