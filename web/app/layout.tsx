import type { Metadata } from 'next';
import { Inter, Fraunces, Bowlby_One } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/lib/animations/LenisProvider';
import { SiteNav } from '@/components/ui/SiteNav';
import { SiteFooter } from '@/components/ui/SiteFooter';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const editorial = Fraunces({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
  axes: ['SOFT', 'opsz']
});
const display = Bowlby_One({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'The Motions — Going Through the Motions',
    template: '%s · The Motions'
  },
  description:
    'A solopreneur brand companion told through Mo Town — twenty-five characters, two hundred and fifty quotes, and an eight-module workbook for going through the motions on purpose.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${editorial.variable} ${display.variable}`}
    >
      <body className="bg-cream text-ink font-sans antialiased">
        <LenisProvider />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
