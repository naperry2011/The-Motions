import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/lib/animations/LenisProvider';
import { SiteNav } from '@/components/ui/SiteNav';
import { SiteFooter } from '@/components/ui/SiteFooter';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'opsz']
});

export const metadata: Metadata = {
  title: {
    default: 'The Motions — Going Through the Motions',
    template: '%s · The Motions'
  },
  description:
    'The Motions is a creative IP and solopreneur brand companion — a cinematic universe set in Mo Town with 250 quotes, 25 characters, and an 8-module workbook for going through the motions on purpose.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="bg-ink-900 text-ink-50 font-sans antialiased">
        <LenisProvider />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
