'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="The Motions home">
          <Image
            src="/assets/logo/motions-outlined.png"
            alt="The Motions"
            width={160}
            height={50}
            priority
            className="h-8 w-auto sm:h-10"
          />
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
          className="shrink-0 rounded-full border-3 border-ink bg-terracotta px-3 py-1.5 text-[10px] font-display uppercase tracking-wider text-cream shadow-cartoon-sm transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2 sm:text-xs"
        >
          <span className="hidden sm:inline">Get the workbook</span>
          <span className="sm:hidden">Workbook</span>
        </Link>
      </nav>
    </header>
  );
}
