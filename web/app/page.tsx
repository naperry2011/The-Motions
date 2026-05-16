import Link from 'next/link';
import Image from 'next/image';
import { allCharacters } from '@/lib/content';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';
import {
  CharacterPortrait,
  CharacterHeroCard,
  hasHeroCard
} from '@/components/decor/CharacterPortrait';

// Six featured Motions: three shadow / three grounded across three pairs,
// chosen to show range without revealing the full cast.
const FEATURED_SLUGS = [
  'quake',    // shadow — Pair 1
  'harbor',   // grounded — Pair 1
  'drift',    // shadow — Pair 7
  'frame',    // grounded — Pair 7
  'sputter',  // shadow — Pair 9
  'flo'       // grounded — Pair 9
];
const featuredCharacters = FEATURED_SLUGS.map(
  (s) => allCharacters.find((c) => c.slug === s)!
).filter(Boolean);

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-paper pt-24 pb-14 sm:pt-32 sm:pb-20">
        <div className="absolute -left-12 top-32 -z-10 animate-wobble">
          <Zigzag className="h-10 w-48 opacity-60" color="#f7c948" strokeWidth={5} />
        </div>
        <div className="absolute right-6 top-40 -z-10">
          <Squiggle className="h-8 w-40 opacity-70" color="#e87454" strokeWidth={5} />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <div>
            <Sticker color="mustard" rotate={-4}>
              A Solopreneur Brand Companion
            </Sticker>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,11vw,7rem)] leading-[0.95] tracking-tight sm:mt-6">
              <span className="display-offset">Going through</span>
              <br />
              <span className="display-offset">the motions,</span>
              <br />
              <span className="font-editorial italic text-teal">on purpose.</span>
            </h1>
            <RevealOnView delay={0.4} className="mt-6 max-w-lg text-base text-ink/80 sm:mt-8 sm:text-lg">
              The internal world of the solopreneur, mapped.
            </RevealOnView>
            <RevealOnView delay={0.55} className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <Link
                href="/universe"
                className="rounded-full border-3 border-ink bg-terracotta px-5 py-2.5 text-[11px] font-display uppercase tracking-wider text-cream shadow-cartoon transition-transform hover:-translate-y-1 sm:px-6 sm:py-3 sm:text-xs"
              >
                Enter Mo Town
              </Link>
            </RevealOnView>
          </div>

          <RevealOnView delay={0.2} className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="relative aspect-square animate-bobble">
              <div className="absolute inset-0 rounded-full bg-mustard" />
              <Image
                src="/assets/characters/quake.webp"
                alt="Quake — the trembling motion"
                fill
                priority
                className="object-contain p-4"
              />
            </div>
            <Sticker
              color="terracotta"
              rotate={6}
              className="absolute -bottom-2 -left-2 text-xs sm:-left-6 sm:text-sm"
            >
              Meet Quake →
            </Sticker>
          </RevealOnView>
        </div>
      </section>

      {/* ── MANIFESTO (teal cinematic) ── */}
      <section className="bg-teal-grain text-cream">
        <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-28">
          <p className="font-display text-mustard text-xs uppercase tracking-[0.3em]">
            The Idea
          </p>
          <TextReveal
            as="h2"
            text="Every solopreneur is a town."
            className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] leading-tight"
          />
          <RevealOnView delay={0.2} className="mx-auto mt-10 max-w-2xl space-y-5 text-lg text-cream/85">
            <p>
              Some days you&apos;re <span className="font-editorial italic text-mustard">Quake</span>
              — the tremble before a decision lands. Some days you&apos;re
              <span className="font-editorial italic text-mustard"> Drift</span>, watching the
              work float by because the wind isn&apos;t yours. Other days, Pilot. Frame.
              Signal. Polish.
            </p>
            <p>
              The Motions is the map of those characters: who they are, where they live, what
              corrupts them, and how they come home. Read the lore. Then go do your work.
            </p>
          </RevealOnView>
        </div>
        <Squiggle className="h-6 w-full rotate-180" color="#f7c948" />
      </section>

      {/* ── CHARACTER GRID ── */}
      <section className="relative bg-paper px-5 py-16 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Sticker color="teal" rotate={-3}>
                The Cast
              </Sticker>
              <h2 className="mt-5 font-display text-5xl leading-[0.95] md:text-6xl">
                <span className="display-offset">Mo Town</span>
                <br />
                <span className="font-editorial italic">runs on motions.</span>
              </h2>
            </div>
            <Link
              href="/universe/characters"
              className="rounded-full border-3 border-ink bg-mustard px-5 py-2 text-xs font-display uppercase tracking-wider text-ink shadow-cartoon-sm hover:-translate-y-0.5 transition-transform"
            >
              Meet the Motions →
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {featuredCharacters.map((c, i) => (
              <RevealOnView key={c.slug} delay={(i % 4) * 0.06}>
                <Link
                  href={`/universe/characters/${c.slug}`}
                  className="group block overflow-hidden rounded-3xl border-3 border-ink bg-cream shadow-cartoon transition-transform hover:-translate-y-1 hover:rotate-[-0.6deg]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ink">
                    {hasHeroCard(c.slug) ? (
                      <CharacterHeroCard
                        slug={c.slug}
                        name={c.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-mustard">
                        <CharacterPortrait
                          slug={c.slug}
                          name={c.name}
                          size={260}
                          className="h-full w-full object-contain p-3"
                        />
                      </div>
                    )}
                  </div>
                  <div className="border-t-3 border-ink px-4 py-3">
                    <p className="font-display text-xl leading-none">{c.name}</p>
                    {c.traits?.represents && (
                      <p className="mt-2 line-clamp-2 text-xs text-ink/60">
                        {c.traits.represents}
                      </p>
                    )}
                  </div>
                </Link>
              </RevealOnView>
            ))}
          </ul>
        </div>
      </section>

      {/* ── BIG BADS TEASE ── */}
      <section className="relative border-y-3 border-ink bg-ink px-5 py-20 text-cream sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-terracotta">
            Something else
          </p>
          <TextReveal
            as="p"
            text="Not every force in Mo Town wants you to find your rhythm."
            className="mt-6 font-editorial text-2xl italic leading-snug text-cream/90 sm:text-3xl md:text-4xl"
          />
        </div>
      </section>

      {/* ── WORKBOOK TEASER ── */}
      <section className="bg-paper px-5 py-16 sm:px-6 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div>
            <Sticker color="terracotta" rotate={-2}>
              The Workbook
            </Sticker>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] md:text-6xl">
              <span className="display-offset">Eight modules.</span>
              <br />
              <span className="font-editorial italic">Two hundred and sixteen paths.</span>
            </h2>
            <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
              <p>
                Going Through the Motions is a workbook for solopreneurs whose work has a
                shape but no rhythm yet. Inner Compass. Safe Runway. Progress Over Perfect.
                True And Seen.
              </p>
            </RevealOnView>
            <RevealOnView delay={0.3} className="mt-8">
              <Link
                href="/workbook"
                className="rounded-full border-3 border-ink bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon hover:-translate-y-0.5 transition-transform"
              >
                The workbook is coming →
              </Link>
            </RevealOnView>
          </div>
          <RevealOnView delay={0.15}>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['02', 'Inner Compass', 'bg-mustard'],
                ['03', 'Safe Runway', 'bg-cream'],
                ['04', 'Progress Over Perfect', 'bg-cream'],
                ['05', 'True And Seen', 'bg-mustard'],
                ['06', 'Message Market Fit', 'bg-mustard'],
                ['07', 'Offer Architecture', 'bg-cream'],
                ['08', 'Rhythm Systems', 'bg-cream'],
                ['09', 'Proof & Performance', 'bg-mustard']
              ].map(([n, t, bg], idx) => (
                <li
                  key={n}
                  className={`rounded-2xl border-3 border-ink p-5 shadow-cartoon-sm ${bg} ${
                    idx % 2 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]'
                  }`}
                >
                  <p className="font-display text-2xl text-terracotta">M{n}</p>
                  <p className="mt-2 font-display text-ink">{t}</p>
                </li>
              ))}
            </ul>
          </RevealOnView>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section
        id="waitlist"
        className="relative bg-teal-grain text-cream"
      >
        <Zigzag className="h-6 w-full" color="#f7c948" />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-6 sm:py-28">
          <Sticker color="mustard" rotate={2}>
            Waitlist
          </Sticker>
          <h2 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
            <span className="display-offset-light">Get the Motions</span>
            <br />
            <span className="font-editorial italic">before it ships.</span>
          </h2>
          <RevealOnView delay={0.2} className="mt-6 text-cream/80">
            <p>
              Join the waitlist for the workbook, character drops, and the first batch of
              guided cohorts.
            </p>
          </RevealOnView>
          <RevealOnView delay={0.3} className="mt-10 flex justify-center">
            <WaitlistForm source="homepage" />
          </RevealOnView>
        </div>
      </section>
    </div>
  );
}
