'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Public launch surface only — Geography, Arcs, Lore, Exacerbators, Quotes
// stay live at their URLs but come off the nav (per site audit, May 2026).
// Story + Quiz will be added in commits 3E + 3F.
const links = [
  { href: '/universe', label: 'Universe' },
  { href: '/universe/characters', label: 'Characters' },
  { href: '/universe/geography', label: 'Geography' },
  { href: '/universe/arcs', label: 'Arcs' },
  { href: '/universe/exacerbators', label: 'Exacerbators' },
  { href: '/universe/lore', label: 'Lore' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/workbook', label: 'Workbook' }
];

// Desktop nav shows only the top-level set; the sheet shows everything.
const topLevelLinks = [
  { href: '/universe', label: 'Universe' },
  { href: '/universe/characters', label: 'Characters' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/workbook', label: 'Workbook' }
];

const topLevelLinks = links;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Scroll-triggered nav background
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + Escape to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          scrolled || open
            ? 'border-b-3 border-ink bg-cream/95 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="The Motions home"
          >
            <Image
              src="/assets/logo/motions-outlined.png"
              alt="The Motions"
              width={160}
              height={50}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 text-sm font-medium text-ink md:flex">
            {topLevelLinks.map((l) => (
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

          {/* Right cluster: workbook CTA on desktop, hamburger on mobile */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/workbook"
              className="hidden rounded-full border-3 border-ink bg-terracotta px-5 py-2 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon-sm transition-transform hover:-translate-y-0.5 md:inline-block"
            >
              Get the workbook
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`grid h-10 w-10 place-items-center rounded-full border-3 border-ink shadow-cartoon-sm transition-colors md:hidden ${
                open ? 'bg-terracotta text-cream' : 'bg-mustard text-ink'
              }`}
            >
              <Hamburger open={open} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
            aria-hidden
          />
        )}
        {open && (
          <motion.aside
            key="mobile-menu"
            id="mobile-menu"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-x-0 top-[60px] z-40 max-h-[calc(100vh-60px)] overflow-y-auto border-b-3 border-ink bg-cream md:hidden"
            role="dialog"
            aria-label="Site menu"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6">
              {links.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-2xl border-3 border-ink px-5 py-4 font-display text-2xl shadow-cartoon-sm transition-transform hover:-translate-y-0.5 ${
                        active
                          ? 'bg-terracotta text-cream'
                          : i % 2 === 0
                            ? 'bg-cream text-ink'
                            : 'bg-mustard text-ink'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="font-editorial text-base italic opacity-70">
                        {active ? 'here' : '→'}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mx-auto max-w-7xl px-5 pb-8">
              <Link
                href="/workbook"
                onClick={() => setOpen(false)}
                className="block w-full rounded-full border-3 border-ink bg-ink px-6 py-4 text-center font-display text-sm uppercase tracking-widest text-cream shadow-cartoon transition-transform hover:-translate-y-0.5"
              >
                Get the workbook ↗
              </Link>
              <p className="mt-5 text-center font-editorial italic text-sm text-ink/60">
                A solopreneur&apos;s brand companion.
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Hamburger({ open }: { open: boolean }) {
  // 3 lines that morph to an X when open
  return (
    <span className="relative inline-block h-4 w-5" aria-hidden>
      <span
        className={`absolute left-0 right-0 h-[3px] rounded-full bg-current transition-all duration-200 ${
          open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
        }`}
      />
      <span
        className={`absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 right-0 h-[3px] rounded-full bg-current transition-all duration-200 ${
          open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
        }`}
      />
    </span>
  );
}
