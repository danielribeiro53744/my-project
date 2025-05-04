import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LoadingScreen } from '@/components/loading/loading';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { MouseEffects } from '@/components/mouse/MouseEffects';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Attire - Modern Fashion Marketplace',
  description: 'Discover the latest trends in fashion with our curated collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MouseEffects />
          <LoadingScreen />
          <div className="transition-opacity duration-300">
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}