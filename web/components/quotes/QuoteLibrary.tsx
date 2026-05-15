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

const PAGE_SIZE = 30;

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
      {/* Toolbar */}
      <div className="sticky top-14 z-30 -mx-5 mb-8 border-y-3 border-ink bg-cream/95 px-5 py-3 backdrop-blur-md sm:top-16 sm:-mx-6 sm:mb-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 250 quotes…"
            className="w-full rounded-full border-3 border-ink bg-cream px-5 py-2 text-sm text-ink placeholder:text-ink/50 focus:border-terracotta focus:outline-none sm:min-w-[14rem] sm:flex-1"
            type="search"
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="flex-1 rounded-full border-3 border-ink bg-cream px-3 py-2 text-[11px] font-display uppercase tracking-wider text-ink focus:border-terracotta focus:outline-none sm:flex-none sm:px-4 sm:text-xs"
              aria-label="Filter by character"
            >
              <option value="all">All · 25</option>
              {characters.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSeed(Math.floor(Math.random() * 9999) + 1)}
              className="shrink-0 rounded-full border-3 border-ink bg-mustard px-3 py-2 text-[11px] font-display uppercase tracking-wider text-ink shadow-cartoon-sm hover:-translate-y-0.5 transition-transform sm:px-4 sm:text-xs"
            >
              Shuffle
            </button>

            <p className="ml-auto font-display text-[11px] text-ink/70 sm:text-xs">
              {filtered.length === quotes.length
                ? `${quotes.length}`
                : `${filtered.length}/${quotes.length}`}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((qt, i) => {
            const hasPost = postSet.has(qt.id);
            const tint = cardColors[i % cardColors.length];
            const tilt = i % 2 === 0 ? '-rotate-[0.4deg]' : 'rotate-[0.4deg]';
            return (
              <motion.li
                key={qt.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={() => setOpen(qt)}
                  className={`flex h-full w-full flex-col justify-between rounded-2xl border-3 border-ink p-5 text-left shadow-cartoon-sm transition-transform hover:-translate-y-1 hover:rotate-0 ${tint} ${tilt}`}
                >
                  <p className="font-display text-base leading-snug text-ink line-clamp-5">
                    &ldquo;{qt.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-editorial italic text-sm text-terracotta">
                      — {qt.character}
                    </p>
                    {hasPost && (
                      <span
                        aria-label="Has poster art"
                        className="rounded-full border-2 border-ink bg-ink/90 px-2 py-0.5 text-[10px] font-display uppercase tracking-wider text-cream"
                      >
                        Poster
                      </span>
                    )}
                  </div>
                </button>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-md"
      onClick={onClose}
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
