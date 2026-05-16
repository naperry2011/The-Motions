'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CharacterHeroCard,
  CharacterPortrait,
  hasHeroCard
} from '@/components/decor/CharacterPortrait';
import { Sticker } from '@/components/decor/Sticker';
import type { CorruptionInteraction, ExacerbatorChain } from '@/lib/content';

const FIELDS: Array<[keyof CorruptionInteraction, string]> = [
  ['whereTheyMeet', 'Where they meet'],
  ['theTrap', 'The trap'],
  ['theSweetPart', 'The sweet part'],
  ['theCorruption', 'The corruption'],
  ['theResult', 'The result']
];

export function ChainSection({
  chain,
  isDark
}: {
  chain: ExacerbatorChain;
  isDark: boolean;
}) {
  const [open, setOpen] = useState<CorruptionInteraction | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Compact header — Exacerbator hero + title side by side */}
      <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr] sm:gap-6">
        <Link
          href={`/universe/characters/${chain.exacerbatorSlug}`}
          className="group inline-block w-28 overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon sm:w-36"
        >
          {hasHeroCard(chain.exacerbatorSlug) ? (
            <CharacterHeroCard
              slug={chain.exacerbatorSlug}
              name={chain.exacerbatorName}
              className="h-auto w-full"
            />
          ) : (
            <CharacterPortrait
              slug={chain.exacerbatorSlug}
              name={chain.exacerbatorName}
              size={144}
              className="h-full w-full object-cover"
            />
          )}
        </Link>
        <div>
          <Sticker color={isDark ? 'mustard' : 'terracotta'} rotate={-3}>
            Exacerbator
          </Sticker>
          <h2 className="mt-3 font-display text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
            <span className={isDark ? 'display-offset-light' : 'display-offset'}>
              {chain.exacerbatorName}&apos;s
            </span>{' '}
            <span className="font-editorial italic text-terracotta">corruptions.</span>
          </h2>
          <p
            className={`mt-3 font-display text-xs uppercase tracking-wider ${
              isDark ? 'text-mustard' : 'text-terracotta'
            }`}
          >
            {chain.interactions.length} documented victims · tap any to expand
          </p>
        </div>
      </div>

      {/* Tile grid */}
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {chain.interactions.map((it) => (
          <li key={it.victimSlug}>
            <CorruptionTile
              interaction={it}
              exacerbatorSlug={chain.exacerbatorSlug}
              exacerbatorName={chain.exacerbatorName}
              isDark={isDark}
              onOpen={() => setOpen(it)}
            />
          </li>
        ))}
      </ul>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <CorruptionModal
            interaction={open}
            exacerbatorSlug={chain.exacerbatorSlug}
            exacerbatorName={chain.exacerbatorName}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CorruptionTile({
  interaction,
  exacerbatorSlug,
  exacerbatorName,
  isDark,
  onOpen
}: {
  interaction: CorruptionInteraction;
  exacerbatorSlug: string;
  exacerbatorName: string;
  isDark: boolean;
  onOpen: () => void;
}) {
  const tileBg = isDark
    ? 'bg-teal-700 border-cream/40 hover:border-mustard'
    : 'bg-cream border-ink hover:border-terracotta';
  const textBody = isDark ? 'text-cream/80' : 'text-ink/75';

  return (
    <button
      onClick={onOpen}
      className={`group flex h-full w-full flex-col rounded-2xl border-3 p-4 text-left shadow-cartoon-sm transition-transform hover:-translate-y-1 sm:p-5 ${tileBg}`}
    >
      <div className="flex items-center gap-3">
        <Avatar slug={exacerbatorSlug} name={exacerbatorName} small />
        <span
          aria-hidden
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink font-display text-base shadow-cartoon-sm ${
            isDark ? 'bg-mustard text-ink' : 'bg-terracotta text-cream'
          }`}
        >
          →
        </span>
        <Avatar slug={interaction.victimSlug} name={interaction.victimName} small />
      </div>
      <p
        className={`mt-3 line-clamp-3 text-xs leading-snug ${textBody}`}
        title={interaction.theTrap}
      >
        &ldquo;{interaction.theTrap}&rdquo;
      </p>
      <p
        className={`mt-3 font-display text-[10px] uppercase tracking-wider ${
          isDark ? 'text-mustard' : 'text-terracotta'
        }`}
      >
        Read corruption →
      </p>
    </button>
  );
}

function Avatar({
  slug,
  name,
  small = false
}: {
  slug: string;
  name: string;
  small?: boolean;
}) {
  const size = small ? 44 : 56;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-ink bg-mustard"
        style={{ width: size, height: size }}
      >
        {hasHeroCard(slug) ? (
          <CharacterHeroCard slug={slug} name={name} className="h-full w-full object-cover" />
        ) : (
          <CharacterPortrait
            slug={slug}
            name={name}
            size={size}
            className="h-full w-full object-cover"
          />
        )}
      </span>
      <span className="truncate font-display text-sm">{name}</span>
    </div>
  );
}

function CorruptionModal({
  interaction,
  exacerbatorSlug,
  exacerbatorName,
  onClose
}: {
  interaction: CorruptionInteraction;
  exacerbatorSlug: string;
  exacerbatorName: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border-3 border-ink bg-cream shadow-cartoon-lg"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border-3 border-ink bg-cream font-display text-ink shadow-cartoon-sm hover:bg-mustard"
        >
          ✕
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <header className="grid items-center gap-3 border-b-3 border-ink bg-ink p-5 text-cream sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:p-6">
            <ModalAvatar
              slug={exacerbatorSlug}
              name={exacerbatorName}
              role="Exacerbator"
              align="left"
            />
            <span
              aria-hidden
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-3 border-cream bg-terracotta font-display text-2xl text-cream shadow-cartoon-sm"
            >
              →
            </span>
            <ModalAvatar
              slug={interaction.victimSlug}
              name={interaction.victimName}
              role="Corrupts"
              align="right"
            />
          </header>

          {/* 5 fields */}
          <dl className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
            {FIELDS.map(([key, label]) => {
              const value = interaction[key];
              if (!value) return null;
              return (
                <div
                  key={key}
                  className="rounded-2xl border-3 border-ink bg-paper p-4 shadow-cartoon-sm sm:p-5"
                >
                  <dt className="font-display text-[11px] uppercase tracking-wider text-terracotta">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/85">{value}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModalAvatar({
  slug,
  name,
  role,
  align
}: {
  slug: string;
  name: string;
  role: string;
  align: 'left' | 'right';
}) {
  return (
    <Link
      href={`/universe/characters/${slug}`}
      className={`group flex items-center gap-3 ${align === 'right' ? 'sm:justify-end' : ''}`}
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border-3 border-cream bg-mustard sm:h-16 sm:w-16">
        {hasHeroCard(slug) ? (
          <CharacterHeroCard slug={slug} name={name} className="h-full w-full object-cover" />
        ) : (
          <CharacterPortrait
            slug={slug}
            name={name}
            size={64}
            className="h-full w-full object-cover"
          />
        )}
      </span>
      <div className={align === 'right' ? 'sm:text-right' : ''}>
        <p className="font-display text-[10px] uppercase tracking-wider text-mustard">
          {role}
        </p>
        <p className="font-display text-xl leading-none text-cream group-hover:text-mustard sm:text-2xl">
          {name}
        </p>
      </div>
    </Link>
  );
}
