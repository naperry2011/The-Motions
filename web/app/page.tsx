import Link from 'next/link';
import { allCharacters, allQuotes } from '@/lib/content';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Marquee } from '@/components/motion/Marquee';
import { Parallax } from '@/components/motion/Parallax';
import { WaitlistForm } from '@/components/ui/WaitlistForm';

const featured = [3, 11, 27, 44, 58, 71, 92, 130, 165, 201, 237].map((i) =>
  allQuotes.find((q) => q.id === i)
);

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-screen items-end overflow-hidden px-6 pb-24 pt-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(242,92,31,0.18),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(124,92,255,0.18),transparent_55%)]" />
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-ember-400">
            A solopreneur&apos;s brand companion
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-tight">
            <TextReveal as="h1" text="Going through the motions, on purpose." />
          </h1>
          <RevealOnView delay={0.6} className="mt-10 max-w-xl text-lg text-ink-100">
            The Motions is a creative universe — a town called Mo Town, twenty-five characters
            who embody the motions we move through, and an eight-module workbook for the work
            that hasn&apos;t found its rhythm yet.
          </RevealOnView>
          <RevealOnView delay={0.9} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/universe"
              className="rounded-full bg-ember-500 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-900 hover:bg-ember-400"
            >
              Enter Mo Town
            </Link>
            <Link
              href="/workbook"
              className="rounded-full border border-ink-300 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-100 hover:border-ember-400 hover:text-ember-400"
            >
              See the workbook
            </Link>
          </RevealOnView>
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-3xl">
          <TextReveal
            as="h2"
            text="Every solopreneur is a town."
            className="font-display text-5xl leading-tight md:text-6xl"
          />
          <RevealOnView delay={0.2} className="mt-10 space-y-6 text-lg text-ink-100">
            <p>
              Some days you&apos;re Quake — the tremble before a decision lands. Some days
              you&apos;re Drift, watching the work float by because the wind isn&apos;t yours.
              Other days, Pilot. Frame. Signal. Polish.
            </p>
            <p>
              The Motions is the map of those characters: who they are, where they live, what
              corrupts them, and how they come home. Read the lore. Then go do your work.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* Universe teaser */}
      <section className="relative overflow-hidden bg-ink-800 px-6 py-32">
        <Parallax speed={0.2} className="absolute inset-x-0 top-0 -z-10">
          <div className="h-[60vh] bg-[radial-gradient(circle_at_50%_50%,rgba(52,214,196,0.15),transparent_60%)]" />
        </Parallax>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-motion-drift">
                The Universe
              </p>
              <TextReveal
                as="h2"
                text="Mo Town: where the motions live."
                className="font-display text-5xl leading-tight md:text-6xl"
              />
            </div>
            <Link
              href="/universe"
              className="text-sm uppercase tracking-widest text-ember-400 hover:text-ember-500"
            >
              Walk the town →
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {allCharacters.slice(0, 10).map((c, i) => (
              <RevealOnView key={c.slug} delay={i * 0.05}>
                <Link
                  href={`/universe/characters/${c.slug}`}
                  className="group block aspect-[3/4] overflow-hidden rounded-2xl border border-ink-600 bg-ink-900/60 p-5 transition-colors hover:border-ember-400"
                >
                  <div className="flex h-full flex-col justify-between">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-ink-300">
                      Motion
                    </p>
                    <div>
                      <p className="font-display text-3xl leading-none">{c.name}</p>
                      <p className="mt-2 text-xs text-ink-300 group-hover:text-ember-400">
                        {c.quoteCount} quotes →
                      </p>
                    </div>
                  </div>
                </Link>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Quote marquee */}
      <section className="border-y border-ink-700/50 bg-ink-900 py-24">
        <p className="mb-10 px-6 text-center text-xs uppercase tracking-[0.4em] text-ember-400">
          From the 250
        </p>
        <Marquee duration={60}>
          {featured.filter(Boolean).map((q) => (
            <span
              key={q!.id}
              className="font-display text-3xl text-ink-100 md:text-4xl"
            >
              &ldquo;{q!.text}&rdquo;
              <span className="ml-4 text-sm uppercase tracking-widest text-motion-spark">
                — {q!.character}
              </span>
            </span>
          ))}
        </Marquee>
        <div className="mt-10 text-center">
          <Link
            href="/quotes"
            className="text-sm uppercase tracking-widest text-ember-400 hover:text-ember-500"
          >
            All 250 quotes →
          </Link>
        </div>
      </section>

      {/* Workbook teaser */}
      <section className="px-6 py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-ember-400">
              The Workbook
            </p>
            <TextReveal
              as="h2"
              text="Eight modules. Twenty-seven paths each."
              className="font-display text-5xl leading-tight md:text-6xl"
            />
            <RevealOnView delay={0.2} className="mt-8 text-lg text-ink-100">
              <p>
                Going Through the Motions is a workbook for solopreneurs whose work has a
                shape but no rhythm yet. Inner Compass. Safe Runway. Progress Over Perfect.
                True And Seen. Eight modules, two hundred and sixteen practical paths.
              </p>
            </RevealOnView>
            <RevealOnView delay={0.3} className="mt-8">
              <Link
                href="/workbook"
                className="rounded-full border border-ember-500 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ember-400 hover:bg-ember-500 hover:text-ink-900"
              >
                Preview the workbook
              </Link>
            </RevealOnView>
          </div>
          <RevealOnView delay={0.15}>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['02', 'Inner Compass'],
                ['03', 'Safe Runway'],
                ['04', 'Progress Over Perfect'],
                ['05', 'True And Seen'],
                ['06', 'Message Market Fit'],
                ['07', 'Offer Architecture'],
                ['08', 'Rhythm Systems'],
                ['09', 'Proof & Performance']
              ].map(([n, t]) => (
                <li
                  key={n}
                  className="rounded-2xl border border-ink-600 bg-ink-800/50 p-5"
                >
                  <p className="font-display text-2xl text-ember-400">M{n}</p>
                  <p className="mt-2 text-ink-100">{t}</p>
                </li>
              ))}
            </ul>
          </RevealOnView>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="border-t border-ink-700/50 bg-gradient-to-b from-ink-900 to-ink-800 px-6 py-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <TextReveal
            as="h2"
            text="Get the Motions before it ships."
            className="font-display text-4xl leading-tight md:text-5xl"
          />
          <RevealOnView delay={0.2} className="mt-6 text-ink-100">
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
