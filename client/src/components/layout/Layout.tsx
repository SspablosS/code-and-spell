import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ backgroundColor: '#1A1A2E', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
