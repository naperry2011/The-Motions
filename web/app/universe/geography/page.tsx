import { geographyDoc } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';
import { BoroughCard } from '@/components/universe/BoroughCard';

export const metadata = { title: 'Geography & Housing' };

// Alternate borough card backgrounds + slight rotations for visual rhythm.
const TINTS = ['cream', 'mustard', 'cream', 'mustard', 'cream'] as const;
const ROTATIONS = [-0.4, 0.3, -0.3, 0.4, -0.2];

export default function GeographyPage() {
  const boroughs = geographyDoc.boroughs ?? [];
  return (
    <div>
      {/* HERO */}
      <section className="bg-paper px-5 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <Sticker color="teal" rotate={-3}>
            Mo Town
          </Sticker>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:mt-6 sm:text-6xl md:text-7xl">
            <span className="display-offset">{geographyDoc.title}</span>
          </h1>
          {geographyDoc.intro && (
            <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg leading-relaxed text-ink/80">
              <p>{geographyDoc.intro}</p>
            </RevealOnView>
          )}
        </div>
      </section>

      {/* THE AESTHETIC band */}
      {geographyDoc.aesthetic && (
        <section className="bg-teal-grain text-cream">
          <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
          <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <Sticker color="mustard" rotate={-2}>
              The Aesthetic
            </Sticker>
            <p className="mx-auto mt-6 max-w-2xl font-editorial text-2xl italic leading-snug text-cream sm:text-3xl">
              {geographyDoc.aesthetic}
            </p>
          </div>
          <Zigzag className="h-5 w-full rotate-180 sm:h-6" color="#f7c948" />
        </section>
      )}

      {/* THE FIVE BOROUGHS */}
      <section className="bg-paper px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-14">
            <Sticker color="terracotta" rotate={-3}>
              The Five Boroughs
            </Sticker>
            <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              <span className="display-offset">Where the motions live.</span>
            </h2>
          </div>

          <ul className="space-y-12 sm:space-y-16">
            {boroughs.map((b, i) => (
              <li key={b.slug}>
                <RevealOnView>
                  <BoroughCard
                    borough={b}
                    tint={TINTS[i % TINTS.length]}
                    rotate={ROTATIONS[i % ROTATIONS.length]}
                  />
                </RevealOnView>
                {i < boroughs.length - 1 && (
                  <div className="mt-12 flex justify-center sm:mt-16">
                    <Squiggle
                      className="h-4 w-40 opacity-60"
                      color="#e87454"
                      strokeWidth={5}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="bg-teal text-cream px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-editorial text-xl italic leading-snug text-mustard sm:text-2xl">
            &ldquo;Before Capital, these boroughs were connected by community, shared spaces,
            and the central Community Center. After Capital, they become more isolated,
            separated by the casino&apos;s influence.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
}
