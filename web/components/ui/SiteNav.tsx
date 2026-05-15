'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [
  { href: '/universe', label: 'Universe' },
  { href: '/universe/characters', label: 'Characters' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/workbook', label: 'Workbook' }
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'border-b-3 border-ink bg-cream/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border-3 border-ink bg-mustard font-display text-ink shadow-cartoon-sm">
            M
          </span>
          <span className="font-display text-lg tracking-tight text-ink">The Motions</span>
        </Link>
        <ul className="hidden items-center gap-7 text-sm font-medium text-ink md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative transition-colors hover:text-terracotta"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/workbook"
          className="rounded-full border-3 border-ink bg-terracotta px-5 py-2 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon-sm transition-transform hover:-translate-y-0.5"
        >
          Get the workbook
        </Link>
      </nav>
    </header>
  );
}
