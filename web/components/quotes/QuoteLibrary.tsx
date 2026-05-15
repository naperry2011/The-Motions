'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  characters,
  quotePostIds
}: {
  quotes: Quote[];
  characters: Character[];
  quotePostIds: number[];
}) {
  const postSet = useMemo(() => new Set(quotePostIds), [quotePostIds]);
  const [active, setActive] = useState<string | 'all'>('all');
  const [q, setQ] = useState('');
  const [seed, setSeed] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [open, setOpen] = useState<Quote | null>(null);

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

  // Reset pagination whenever the filter changes
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [active, q, seed]);

  // Close modal on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

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

          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="rounded-full border-3 border-ink bg-cream px-4 py-2 text-xs font-display uppercase tracking-wider text-ink focus:border-terracotta focus:outline-none"
            aria-label="Filter by character"
          >
            <option value="all">All characters · 25</option>
            {characters.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

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
          {filtered.map((qt, i) => {
            const hasPost = postSet.has(qt.id);
            return (
              <motion.li
                key={qt.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`group overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-sm ${
                  hasPost ? 'bg-ink' : cardColors[i % cardColors.length]
                } ${i % 2 === 0 ? '-rotate-[0.4deg]' : 'rotate-[0.4deg]'}`}
              >
                {hasPost ? (
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={`/assets/quote-posts/${qt.id}.webp`}
                      alt={`${qt.character}: ${qt.text}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 border-t-3 border-ink bg-cream/95 px-5 py-3 backdrop-blur-sm">
                      <p className="font-editorial italic text-terracotta">
                        — {qt.character}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="font-display text-xl leading-snug text-ink">
                      &ldquo;{qt.text}&rdquo;
                    </p>
                    <p className="mt-4 font-editorial italic text-terracotta">
                      — {qt.character}
                    </p>
                  </div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Load more */}
      <div className="mt-12 flex flex-col items-center gap-3">
        {hasMore ? (
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border-3 border-ink bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon hover:-translate-y-0.5 transition-transform"
          >
            Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
          </button>
        ) : filtered.length > PAGE_SIZE ? (
          <p className="font-editorial italic text-ink/60">
            That&apos;s every quote in this filter.
          </p>
        ) : null}
        {filtered.length === 0 && (
          <p className="font-editorial italic text-ink/60">
            No quotes match. Try a different word or character.
          </p>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <QuoteModal quote={open} hasPost={postSet.has(open.id)} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuoteModal({
  quote,
  hasPost,
  onClose
}: {
  quote: Quote;
  hasPost: boolean;
  onClose: () => void;
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
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg ${
          hasPost ? 'bg-ink' : 'bg-cream'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border-3 border-ink bg-cream font-display text-ink shadow-cartoon-sm hover:bg-mustard"
          aria-label="Close"
        >
          ✕
        </button>

        {hasPost ? (
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={`/assets/quote-posts/${quote.id}.webp`}
              alt={`${quote.character}: ${quote.text}`}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 border-t-3 border-ink bg-cream/95 px-6 py-4 backdrop-blur-sm">
              <p className="font-editorial italic text-terracotta">— {quote.character}</p>
            </div>
          </div>
        ) : (
          <div className="px-8 py-12">
            <p className="font-display text-3xl leading-snug text-ink md:text-4xl">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="mt-6 font-editorial italic text-lg text-terracotta">
              — {quote.character}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
