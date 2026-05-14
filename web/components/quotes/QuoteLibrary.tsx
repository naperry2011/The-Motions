'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quote, Character } from '@/lib/content';

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
      // deterministic shuffle from seed
      list = [...list].sort((a, b) => ((a.id * seed) % 997) - ((b.id * seed) % 997));
    }
    return list;
  }, [quotes, active, q, seed]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-6 mb-12 border-y border-ink-700/60 bg-ink-900/85 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search quotes…"
            className="w-full rounded-full border border-ink-600 bg-ink-800/60 px-5 py-2 text-sm placeholder:text-ink-400 focus:border-ember-400 focus:outline-none md:max-w-xs"
            type="search"
          />
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 9999) + 1)}
            className="rounded-full border border-ember-500 px-4 py-2 text-xs font-medium uppercase tracking-widest text-ember-400 hover:bg-ember-500 hover:text-ink-900"
          >
            Shuffle
          </button>
          <p className="text-xs text-ink-300 md:ml-auto">{filtered.length} / {quotes.length}</p>
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

      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((qt) => (
            <motion.li
              key={qt.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-ink-700 bg-ink-800/40 p-6"
            >
              <p className="font-display text-xl leading-snug text-ink-50">&ldquo;{qt.text}&rdquo;</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-motion-spark">
                — {qt.character}
              </p>
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
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? 'border-ember-500 bg-ember-500 text-ink-900'
          : 'border-ink-600 text-ink-200 hover:border-ember-400 hover:text-ember-400'
      }`}
    >
      {children}
    </button>
  );
}
