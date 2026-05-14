import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-700/50 bg-ink-900 px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row">
        <div className="max-w-sm">
          <p className="font-display text-2xl">The Motions</p>
          <p className="mt-4 text-sm text-ink-200">
            A solopreneur&apos;s brand companion, told through Mo Town — a universe where
            characters embody the motions we move through to do meaningful work.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-ink-200 md:grid-cols-3">
          <div>
            <p className="mb-3 font-medium text-ink-50">Explore</p>
            <ul className="space-y-2">
              <li>
                <Link href="/universe">Universe</Link>
              </li>
              <li>
                <Link href="/universe/characters">Characters</Link>
              </li>
              <li>
                <Link href="/universe/geography">Geography</Link>
              </li>
              <li>
                <Link href="/universe/lore">Lore</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium text-ink-50">Read</p>
            <ul className="space-y-2">
              <li>
                <Link href="/quotes">Quote library</Link>
              </li>
              <li>
                <Link href="/universe/arcs">Character arcs</Link>
              </li>
              <li>
                <Link href="/universe/exacerbators">Exacerbators</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium text-ink-50">Workbook</p>
            <ul className="space-y-2">
              <li>
                <Link href="/workbook">Overview</Link>
              </li>
              <li>
                <Link href="/workbook#waitlist">Join the waitlist</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-7xl text-xs text-ink-400">
        © {new Date().getFullYear()} The Motions. All rights reserved.
      </p>
    </footer>
  );
}
