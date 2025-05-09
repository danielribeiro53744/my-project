// components/layout/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname === '/api/swagger';

  return (
    <>
      {!hideLayout && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
