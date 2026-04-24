import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { MagicParticles } from '../ui/MagicParticles';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ backgroundColor: '#1A1A2E', minHeight: '100vh', color: 'white' }}>
      <MagicParticles />
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', paddingTop: '80px' }}>
        {children}
      </main>
    </div>
  );
}
