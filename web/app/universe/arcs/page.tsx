import { arcsDoc } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';
import { MechanismSteps } from '@/components/universe/MechanismSteps';
import { PairArcCard } from '@/components/universe/PairArcCard';

export const metadata = { title: 'Character Arcs' };

// Alternating tints + slight rotations for the 9 pair cards
const TINTS = ['cream', 'mustard', 'teal', 'cream', 'mustard', 'cream', 'teal', 'mustard', 'cream'] as const;
const ROTATIONS = [-0.4, 0.3, -0.2, 0.4, -0.3, 0.2, -0.4, 0.3, -0.2];

export default function ArcsPage() {
  const mechanism = arcsDoc.mechanism ?? [];
  const arcs = arcsDoc.arcs ?? [];

  return (
    <div>
      {/* HERO */}
      <section className="bg-paper px-5 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <Sticker color="terracotta" rotate={-3}>
            Transformations
          </Sticker>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:mt-6 sm:text-6xl md:text-7xl">
            <span className="display-offset">{arcsDoc.title}</span>
          </h1>
          <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg leading-relaxed text-ink/80">
            <p>
              How Shadow States move toward Grounded States — the universal arc every
              Motion travels. Below, the five-step healing mechanism that holds for all
              of Mo Town, then each of the nine paired transformations.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* MECHANISM */}
      {mechanism.length > 0 && (
        <section className="bg-paper px-5 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center sm:mb-10">
              <Sticker color="mustard" rotate={-2}>
                The Core Healing Mechanism
              </Sticker>
              <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
                <span className="display-offset">Five steps,</span>{' '}
                <span className="font-editorial italic">not a straight line.</span>
              </h2>
            </div>
            <RevealOnView>
              <MechanismSteps steps={mechanism} />
            </RevealOnView>
            {arcsDoc.importantNote && (
              <RevealOnView delay={0.15} className="mt-10 sm:mt-14">
                <div className="mx-auto max-w-3xl rounded-3xl border-3 border-ink bg-terracotta/15 px-6 py-7 text-center shadow-cartoon-sm sm:px-10 sm:py-9">
                  <p className="font-editorial text-xl italic leading-snug text-ink/85 sm:text-2xl">
                    &ldquo;{arcsDoc.importantNote}&rdquo;
                  </p>
                </div>
              </RevealOnView>
            )}
          </div>
        </section>
      )}

      {/* PAIR ARCS */}
      <section className="bg-teal-grain px-5 py-16 text-cream sm:px-6 sm:py-24">
        <Squiggle className="absolute -mt-16 h-5 w-full sm:-mt-24 sm:h-6" color="#f7c948" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-14">
            <Sticker color="mustard" rotate={-3}>
              Pair-by-Pair Transformation Arcs
            </Sticker>
            <h2 className="mt-5 font-display text-3xl leading-tight text-cream sm:text-4xl md:text-5xl">
              <span className="display-offset-light">Nine pairings,</span>
              <br />
              <span className="font-editorial italic">nine ways home.</span>
            </h2>
          </div>

          <ul className="space-y-12 sm:space-y-16">
            {arcs.map((a, i) => (
              <li key={a.shadowSlug}>
                <RevealOnView>
                  <PairArcCard
                    arc={a}
                    tint={TINTS[i % TINTS.length]}
                    rotate={ROTATIONS[i % ROTATIONS.length]}
                  />
                </RevealOnView>
                {i < arcs.length - 1 && (
                  <div className="mt-10 flex justify-center sm:mt-14">
                    <Zigzag
                      className="h-4 w-40 opacity-70"
                      color="#f7c948"
                      strokeWidth={5}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLOSING NOTE */}
      <section className="bg-paper px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Sticker color="terracotta" rotate={2}>
            One More Thing
          </Sticker>
          <p className="mt-6 font-editorial text-xl italic leading-snug text-ink/85 sm:text-2xl">
            Individual healing isn&apos;t enough when the system is sick. The Motions
            help each other transform — but as long as Capital corrupts Mo Town, each
            arc plays in a city that&apos;s working against it.
          </p>
        </div>
      </section>
    </div>
  );
}
