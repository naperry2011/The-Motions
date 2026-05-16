import Link from 'next/link';
import Image from 'next/image';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { PUBLIC_CHARACTER_SLUGS } from '@/lib/public-roster';

type Tile = {
  title: string;
  desc: string;
  bg: string;
  href?: string;
  status?: 'live' | 'soon' | 'locked';
  badge?: string;
};

// Public launch tiles — Geography becomes a "coming soon" notice, Exacerbators
// becomes a shadowed/locked teaser, and Arcs / Lore / Quotes are pulled
// entirely (their URLs still resolve for direct visits). Per site audit.
const tiles: Tile[] = [
  {
    title: 'Characters',
    desc: 'The eighteen base Motions who live in Mo Town.',
    bg: 'bg-mustard',
    href: '/universe/characters',
    status: 'live'
  },
  {
    title: 'Geography & Housing',
    desc: 'An interactive map of Mo Town is in development.',
    bg: 'bg-cream',
    status: 'soon',
    badge: 'Coming soon'
  },
  {
    title: 'The Exacerbators',
    desc: "Something's coming.",
    bg: 'bg-ink text-cream',
    status: 'locked',
    badge: 'Locked'
  }
];

export default function UniversePage() {
  return (
    <div className="bg-paper px-5 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
      <section className="mx-auto max-w-7xl">
        <Sticker color="terracotta" rotate={-4}>
          The Universe
        </Sticker>
        <h1 className="mt-5 font-display text-[clamp(3rem,14vw,12rem)] leading-none sm:mt-6">
          <span className="display-offset">Mo Town.</span>
        </h1>
        <RevealOnView delay={0.3} className="mt-10 max-w-2xl text-lg text-ink/80">
          <p>
            A town built to hold the motions a solopreneur moves through — the trembles, the
            drifts, the bossy boots, the polish — so they have somewhere to live other than
            your nervous system.
          </p>
        </RevealOnView>

        <RevealOnView delay={0.4} className="mt-14">
          <div className="overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg">
            <Image
              src="/assets/illustrations/welcome.webp"
              width={1600}
              height={840}
              alt="Welcome to Mo Town — where inner work has a zip code"
              className="h-auto w-full"
              priority
            />
          </div>
        </RevealOnView>
      </section>

      <section className="mx-auto mt-20 max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => {
            const inner = (
              <>
                {t.badge ? (
                  <p
                    className={`font-display text-xs uppercase tracking-wider ${
                      t.status === 'locked' ? 'text-mustard' : 'text-terracotta'
                    }`}
                  >
                    {t.badge}
                  </p>
                ) : (
                  <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                    Enter
                  </p>
                )}
                <p className="mt-6 font-display text-3xl">{t.title}</p>
                <p
                  className={`mt-4 text-sm ${
                    t.status === 'locked' ? 'text-cream/70' : 'text-ink/70'
                  }`}
                >
                  {t.desc}
                </p>
                {t.status === 'live' && (
                  <p className="mt-8 font-display text-xs uppercase tracking-wider text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
                    Walk in →
                  </p>
                )}
              </>
            );

            const baseClass = `group block h-full rounded-3xl border-3 border-ink p-8 shadow-cartoon ${t.bg}`;
            if (t.status === 'live' && t.href) {
              return (
                <RevealOnView key={t.title} delay={i * 0.06}>
                  <Link
                    href={t.href}
                    className={`${baseClass} transition-transform hover:-translate-y-1 hover:rotate-[-0.4deg]`}
                  >
                    {inner}
                  </Link>
                </RevealOnView>
              );
            }
            return (
              <RevealOnView key={t.title} delay={i * 0.06}>
                <div className={`${baseClass} cursor-default opacity-95`} aria-disabled>
                  {inner}
                </div>
              </RevealOnView>
            );
          })}
        </div>

        {/* Closing teaser block */}
        <RevealOnView delay={0.3} className="mt-16">
          <div className="rounded-3xl border-3 border-ink bg-mustard px-6 py-8 shadow-cartoon-lg sm:px-10 sm:py-10">
            <p className="font-display text-xs uppercase tracking-wider text-terracotta">
              Keep reading
            </p>
            <p className="mt-4 font-editorial text-2xl italic leading-snug text-ink sm:text-3xl">
              Mo Town is bigger than what you&apos;ve seen. More of the world unlocks
              as the story unfolds.
            </p>
          </div>
        </RevealOnView>

        <p className="mt-10 font-display text-sm text-ink/70">
          {PUBLIC_CHARACTER_SLUGS.length} characters live · more on the way
        </p>
      </section>
    </div>
  );
}
