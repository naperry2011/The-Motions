import Link from 'next/link';
import { Squiggle } from '@/components/decor/Squiggle';

export function SiteFooter() {
  return (
    <footer className="bg-teal text-cream">
      <Squiggle className="h-6 w-full" color="#f7c948" />
      <div className="px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <p className="font-display text-3xl">The Motions</p>
            <p className="mt-4 text-sm text-cream/80">
              A solopreneur&apos;s brand companion, told through Mo Town — a universe where
              characters embody the motions we move through to do meaningful work.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm text-cream/85 md:grid-cols-3">
            <div>
              <p className="mb-3 font-display text-mustard">Explore</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/universe" className="hover:text-mustard">
                    Universe
                  </Link>
                </li>
                <li>
                  <Link href="/universe/characters" className="hover:text-mustard">
                    Characters
                  </Link>
                </li>
                <li>
                  <Link href="/universe/geography" className="hover:text-mustard">
                    Geography
                  </Link>
                </li>
                <li>
                  <Link href="/universe/lore" className="hover:text-mustard">
                    Lore
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-display text-mustard">Read</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/quotes" className="hover:text-mustard">
                    Quote library
                  </Link>
                </li>
                <li>
                  <Link href="/universe/arcs" className="hover:text-mustard">
                    Character arcs
                  </Link>
                </li>
                <li>
                  <Link href="/universe/exacerbators" className="hover:text-mustard">
                    Exacerbators
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-display text-mustard">Workbook</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/workbook" className="hover:text-mustard">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/workbook#waitlist" className="hover:text-mustard">
                    Join the waitlist
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-16 max-w-7xl text-xs text-cream/60">
          © {new Date().getFullYear()} The Motions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
