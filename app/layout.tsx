import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { QueryProvider } from '@/components/providers/query-provider';
import { LocaleHydrator } from '@/lib/i18n/locale-hydrator';
import { SessionHydrator } from '@/lib/stores/session-hydrator';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HistoricStays',
  description: 'Stays inside historic buildings across Europe.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <LocaleHydrator />
          <SessionHydrator />
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
