import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { getHomeLayoutMetadata } from '@/lib/api/page-seo';
import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer/footer';
import { LenisProvider } from '@/components/providers/LenisProvider';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  return getHomeLayoutMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="en"
      className={`${playfairDisplay.variable} ${outfit.variable} antialiased bg-surface`}
    >
      <body className="min-h-full flex flex-col bg-surface">
        <LenisProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
