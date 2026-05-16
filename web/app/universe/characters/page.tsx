import Link from 'next/link';
import { allCharacters } from '@/lib/content';
import { isPublicCharacter } from '@/lib/public-roster';
import { RevealOnView } from '@/components/motion/RevealOnView';
import {
  CharacterPortrait,
  CharacterHeroCard,
  hasHeroCard
} from '@/components/decor/CharacterPortrait';
import { Sticker } from '@/components/decor/Sticker';

export const metadata = { title: 'Characters' };

export default function CharactersPage() {
  // 18 base Motions (9 Shadow + 9 Grounded). Capital + 6 Exacerbators are
  // hidden until the graphic novel introduces them — see lib/public-roster.ts.
  const publicCharacters = allCharacters.filter((c) => isPublicCharacter(c.slug));

  return (
    <div className="bg-paper px-5 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
      <section className="mx-auto max-w-7xl">
        <Sticker color="mustard" rotate={-3}>
          The Mo Town Cast
        </Sticker>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:mt-6 sm:text-6xl md:text-7xl">
          <span className="display-offset">The eighteen.</span>
        </h1>
        <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
          <p>
            Each character is a motion — a way solopreneur work moves through us. Nine
            Shadow states and their nine Grounded counterparts.
          </p>
        </RevealOnView>
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {publicCharacters.map((c, i) => (
          <RevealOnView key={c.slug} delay={(i % 10) * 0.04}>
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
                  <div
                    className={`flex h-full w-full items-center justify-center ${
                      i % 3 === 0
                        ? 'bg-mustard'
                        : i % 3 === 1
                          ? 'bg-cream'
                          : 'bg-terracotta/30'
                    }`}
                  >
                    <CharacterPortrait
                      slug={c.slug}
                      name={c.name}
                      size={280}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                )}
              </div>
              <div className="border-t-3 border-ink px-4 py-3">
                <p className="font-display text-xl leading-none">{c.name}</p>
                <p className="mt-2 text-xs text-ink/60">{c.quoteCount} quotes →</p>
              </div>
            </Link>
          </RevealOnView>
        ))}
      </section>

      {/* Closing tease — there are more characters not yet introduced */}
      <section className="mx-auto mt-16 max-w-3xl text-center">
        <RevealOnView>
          <div className="rounded-3xl border-3 border-ink bg-ink px-6 py-8 text-cream shadow-cartoon-lg sm:px-10 sm:py-10">
            <p className="font-display text-xs uppercase tracking-wider text-mustard">
              And then…
            </p>
            <p className="mt-4 font-editorial text-2xl italic leading-snug sm:text-3xl">
              There are more characters in Mo Town you haven&apos;t met yet.
            </p>
          </div>
        </RevealOnView>
      </section>
    </div>
  );
}
