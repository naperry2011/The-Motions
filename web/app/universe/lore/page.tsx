import { loreDoc } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle } from '@/components/decor/Squiggle';
import { LoreChapter } from '@/components/universe/LoreChapter';

export const metadata = { title: 'Universe Lore' };

// A scene illustration paired with select chapter slugs.
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

const CHAPTER_PULL_QUOTES: Record<string, string> = {
  'the-core-concept':
    "You're not just building them a brand. You're helping them rebuild their Community Center.",
  'your-heart-structure-method-as-mo-town-healing':
    "The Motions help each other transform — but only when somebody first sees they're not alone in the city."
};

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
            <p className="font-editorial text-2xl italic text-terracotta sm:text-3xl">
              Your clients are experiencing Mo Town.
            </p>
            <p className="mt-6">
              When an entrepreneur comes to you feeling anxious, confused, stuck,
              overwhelmed — they&apos;re literally living in their own internal Mo Town
              that&apos;s been disrupted. Twelve chapters below — tap any to read; the
              first is already open.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* CHAPTER ACCORDION */}
      <article className="bg-paper">
        {chapters.map((c, i) => (
          <div key={c.slug}>
            <LoreChapter
              index={i + 1}
              title={c.title}
              slug={c.slug}
              bodyHtml={c.bodyHtml}
              image={CHAPTER_IMAGES[c.slug]}
              pullQuote={CHAPTER_PULL_QUOTES[c.slug]}
              stickerTint={STICKER_TINTS[i % STICKER_TINTS.length]}
              defaultOpen={i === 0}
              alt={i % 2 === 1}
            />
            {/* Divider between chapter rows */}
            <div className="bg-paper">
              <div className="mx-auto max-w-3xl border-t-3 border-ink/15 px-5 sm:px-6" />
            </div>
          </div>
        ))}
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
