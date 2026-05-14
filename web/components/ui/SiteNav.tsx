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
        scrolled ? 'bg-ink-900/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          The Motions
        </Link>
        <ul className="hidden items-center gap-8 text-sm text-ink-100 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="transition-colors hover:text-ember-400"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/workbook"
          className="rounded-full border border-ember-500 px-4 py-2 text-xs font-medium uppercase tracking-widest text-ember-400 transition-colors hover:bg-ember-500 hover:text-ink-900"
        >
          Get the workbook
        </Link>
      </nav>
    </header>
  );
}
