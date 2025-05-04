"use client"
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation'; // Import this

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Attire - Modern Fashion Marketplace',
//   description: 'Discover the latest trends in fashion with our curated collection',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current pathname

  // Conditionally render Header and Footer based on the pathname
  const isSwaggerRoute = pathname === '/api/swagger';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isSwaggerRoute && <Header />} {/* Only render Header if not on /api/swagger */}
          <main className="min-h-screen">
            {children}
          </main>
          {!isSwaggerRoute && <Footer />} {/* Only render Footer if not on /api/swagger */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
