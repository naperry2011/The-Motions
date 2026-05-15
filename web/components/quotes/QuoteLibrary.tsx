'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quote, Character } from '@/lib/content';

const cardColors = [
  'bg-cream',
  'bg-mustard',
  'bg-terracotta/25',
  'bg-cream',
  'bg-mustard'
] as const;

export function QuoteLibrary({
  quotes,
  characters
}: {
  quotes: Quote[];
  characters: Character[];
}) {
  const [active, setActive] = useState<string | 'all'>('all');
  const [q, setQ] = useState('');
  const [seed, setSeed] = useState(0);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = quotes;
    if (active !== 'all') list = list.filter((x) => x.characterSlug === active);
    if (term) list = list.filter((x) => x.text.toLowerCase().includes(term));
    if (seed) {
      list = [...list].sort((a, b) => ((a.id * seed) % 997) - ((b.id * seed) % 997));
    }
    return list;
  }, [quotes, active, q, seed]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-6 mb-12 border-y-3 border-ink bg-cream/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search quotes…"
            className="w-full rounded-full border-3 border-ink bg-cream px-5 py-2 text-sm text-ink placeholder:text-ink/50 focus:border-terracotta focus:outline-none md:max-w-xs"
            type="search"
          />
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 9999) + 1)}
            className="rounded-full border-3 border-ink bg-mustard px-4 py-2 text-xs font-display uppercase tracking-wider text-ink shadow-cartoon-sm hover:-translate-y-0.5 transition-transform"
          >
            Shuffle
          </button>
          <p className="font-display text-xs text-ink/70 md:ml-auto">
            {filtered.length} / {quotes.length}
          </p>
        </div>
        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap gap-2">
          <Chip active={active === 'all'} onClick={() => setActive('all')}>
            All
          </Chip>
          {characters.map((c) => (
            <Chip
              key={c.slug}
              active={active === c.slug}
              onClick={() => setActive(c.slug)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((qt, i) => (
            <motion.li
              key={qt.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl border-3 border-ink p-6 shadow-cartoon-sm ${cardColors[i % cardColors.length]} ${
                i % 2 === 0 ? '-rotate-[0.4deg]' : 'rotate-[0.4deg]'
              }`}
            >
              <p className="font-display text-xl leading-snug text-ink">
                &ldquo;{qt.text}&rdquo;
              </p>
              <p className="mt-4 font-editorial italic text-terracotta">— {qt.character}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-3 px-3 py-1 text-xs font-display uppercase tracking-wider transition-transform hover:-translate-y-0.5 ${
        active
          ? 'border-ink bg-terracotta text-cream shadow-cartoon-sm'
          : 'border-ink bg-cream text-ink hover:bg-mustard'
      }`}
    >
      {children}
    </button>
  );
}
