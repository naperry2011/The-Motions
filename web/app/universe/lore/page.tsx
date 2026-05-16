import Image from 'next/image';
import { loreDoc } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle } from '@/components/decor/Squiggle';

export const metadata = { title: 'Universe Lore' };

// A scene illustration paired with select chapter slugs to break up
// the long-form prose. Chapters without an image just get a squiggle.
const CHAPTER_IMAGES: Record<
  string,
  { src: string; alt: string; caption?: string }
> = {
  'the-core-concept': {
    src: '/assets/illustrations/welcome.webp',
    alt: 'Welcome to Mo Town — Where inner work has a zip code',
    caption: "Mo Town's billboard — the doorway into your client's inner city."
  },
  'how-entrepreneurs-experience-these-states': {
    src: '/assets/illustrations/cast.webp',
    alt: 'The full Mo Town cast — all twenty-five motions',
    caption: 'The full Mo Town cast — every state your client cycles through.'
  },
  'your-heart-structure-method-as-mo-town-healing': {
    src: '/assets/scenes/harbor.webp',
    alt: "Harbor's grounded sanctuary",
    caption: 'Grounded states are where the work actually settles.'
  },
  'the-exacerbators-as-what-youre-protecting-them-from': {
    src: '/assets/scenes/capital.webp',
    alt: "Capital's casino office — the corrupting force",
    caption: 'The Gilt — the corruption your work protects them from.'
  },
  'the-full-client-journey-mapped-to-mo-town': {
    src: '/assets/illustrations/cast.webp',
    alt: 'Mo Town cast, journey-mapped',
    caption: 'Every client travels Mo Town. The map is the method.'
  }
};

// Pull-quotes for chapters where a single line carries the chapter
// (manually curated for editorial pacing).
const CHAPTER_PULL_QUOTES: Record<string, string> = {
  'the-core-concept':
    "You're not just building them a brand. You're helping them rebuild their Community Center.",
  'your-heart-structure-method-as-mo-town-healing':
    "The Motions help each other transform — but only when somebody first sees they're not alone in the city."
};

// Sticker eyebrow rotation alternating left/right for rhythm
const STICKER_TINTS = ['mustard', 'terracotta', 'teal', 'cream'] as const;

export default function LorePage() {
  const chapters = loreDoc.chapters ?? [];

  return (
    <div>
      {/* HERO */}
      <section className="bg-paper px-5 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16">
        <div className="mx-auto max-w-4xl">
          <Sticker color="cream" rotate={-3}>
            The Connection
          </Sticker>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:mt-6 sm:text-6xl md:text-7xl">
            <span className="display-offset">{loreDoc.title}</span>
          </h1>
          <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg leading-relaxed text-ink/80">
            <p className="font-editorial italic text-2xl text-terracotta sm:text-3xl">
              Your clients are experiencing Mo Town.
            </p>
            <p className="mt-6">
              When an entrepreneur comes to you feeling anxious, confused, stuck,
              overwhelmed — they&apos;re literally living in their own internal Mo Town
              that&apos;s been disrupted. The pages below map every state, every
              exacerbator, and every door you can open as their brand companion.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* CHAPTERS */}
      <article className="bg-paper">
        {chapters.map((c, i) => {
          const image = CHAPTER_IMAGES[c.slug];
          const pullQuote = CHAPTER_PULL_QUOTES[c.slug];
          const tint = STICKER_TINTS[i % STICKER_TINTS.length];
          const isAlt = i % 2 === 1; // alternating subtle bg tint
          return (
            <section
              key={c.slug}
              className={isAlt ? 'bg-cream' : 'bg-paper'}
              id={c.slug}
            >
              <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
                <RevealOnView>
                  <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                    Chapter {String(i + 1).padStart(2, '0')}
                  </p>
                  <Sticker color={tint} rotate={i % 2 === 0 ? -2 : 2}>
                    The Lore
                  </Sticker>
                  <h2 className="mt-4 font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
                    <span className="display-offset">{c.title}</span>
                  </h2>
                </RevealOnView>

                {image && (
                  <RevealOnView delay={0.1} className="mt-8">
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
                        <figcaption className="border-t-3 border-ink bg-paper px-5 py-3 text-center font-editorial italic text-sm text-ink/70 sm:text-base">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  </RevealOnView>
                )}

                <RevealOnView delay={0.15} className="mt-8 sm:mt-10">
                  <div
                    className="lore-prose"
                    dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
                  />
                </RevealOnView>

                {pullQuote && (
                  <RevealOnView delay={0.2} className="mt-10 sm:mt-12">
                    <blockquote className="rounded-3xl border-3 border-ink bg-mustard px-6 py-7 shadow-cartoon-lg sm:px-10 sm:py-9">
                      <p className="font-editorial text-2xl italic leading-snug text-ink sm:text-3xl">
                        &ldquo;{pullQuote}&rdquo;
                      </p>
                    </blockquote>
                  </RevealOnView>
                )}
              </div>

              {/* Divider between chapters */}
              {i < chapters.length - 1 && (
                <div className="flex justify-center pb-8">
                  <Squiggle
                    className="h-4 w-40 opacity-60"
                    color="#e87454"
                    strokeWidth={5}
                  />
                </div>
              )}
            </section>
          );
        })}
      </article>

      {/* CLOSING */}
      <section className="bg-teal-grain text-cream">
        <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-24">
          <Sticker color="mustard" rotate={2}>
            The Last Word
          </Sticker>
          <p className="mt-6 font-editorial text-2xl italic leading-snug text-cream sm:text-3xl">
            Mo Town is the map. The Motions are the people. The work is helping your
            client come home.
          </p>
        </div>
      </section>
    </div>
  );
}
