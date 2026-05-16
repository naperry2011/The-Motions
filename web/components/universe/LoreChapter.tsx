'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sticker } from '@/components/decor/Sticker';

type ChapterImage = { src: string; alt: string; caption?: string };

export function LoreChapter({
  index,
  title,
  slug,
  bodyHtml,
  image,
  pullQuote,
  stickerTint,
  defaultOpen = false,
  alt = false
}: {
  index: number;
  title: string;
  slug: string;
  bodyHtml: string;
  image?: ChapterImage;
  pullQuote?: string;
  stickerTint: 'mustard' | 'terracotta' | 'teal' | 'cream';
  defaultOpen?: boolean;
  alt?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // Approximate reading time from body text length (≈ 200 wpm, 5 chars/word).
  const wordCount = Math.max(40, Math.round(bodyHtml.replace(/<[^>]+>/g, '').length / 5));
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <section id={slug} className={alt ? 'bg-cream' : 'bg-paper'}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        {/* Header — always visible, click to toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${slug}-body`}
          className="group flex w-full items-center gap-4 py-6 text-left sm:py-7"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-3 border-ink bg-mustard font-display text-sm text-ink shadow-cartoon-sm sm:h-14 sm:w-14 sm:text-base">
            {String(index).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Sticker color={stickerTint} rotate={index % 2 === 0 ? -2 : 2}>
                Chapter
              </Sticker>
              {image && (
                <span className="hidden rounded-full border-2 border-ink bg-ink px-2 py-0.5 font-display text-[10px] uppercase tracking-wider text-cream sm:inline">
                  + Scene
                </span>
              )}
              <span className="ml-auto hidden font-display text-xs text-ink/60 sm:inline">
                {readMinutes} min read
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl leading-[1.05] sm:text-3xl md:text-4xl">
              <span className="display-offset">{title}</span>
            </h2>
          </div>
          <span
            aria-hidden
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-3 border-ink bg-cream font-display text-lg text-ink shadow-cartoon-sm transition-transform sm:h-12 sm:w-12 ${
              open ? 'rotate-45 bg-terracotta text-cream' : 'group-hover:bg-mustard'
            }`}
          >
            +
          </span>
        </button>

        {/* Body — expandable */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              id={`${slug}-body`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-12 pt-2 sm:pb-16">
                {image && (
                  <figure className="overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg">
                    <div className="relative aspect-[16/9] w-full bg-ink">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="border-t-3 border-ink bg-paper px-5 py-3 text-center font-editorial text-sm italic text-ink/70 sm:text-base">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                <div
                  className="lore-prose mt-8 sm:mt-10"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />

                {pullQuote && (
                  <blockquote className="mt-10 rounded-3xl border-3 border-ink bg-mustard px-6 py-7 shadow-cartoon-lg sm:mt-12 sm:px-10 sm:py-9">
                    <p className="font-editorial text-2xl italic leading-snug text-ink sm:text-3xl">
                      &ldquo;{pullQuote}&rdquo;
                    </p>
                  </blockquote>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
