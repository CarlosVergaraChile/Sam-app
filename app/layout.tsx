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
        <div className="min-h-screen flex flex-col">
          <nav className="bg-blue-600 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">SAM v6</h1>
              <div className="space-x-4">
                <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded">Home</a>
                <a href="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</a>
                <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</a>
              </div>
            </div>
          </nav>
          <main className="flex-1">
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
