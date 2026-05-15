import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allCharacters, getCharacter, getQuotesByCharacter } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import {
  CharacterPortrait,
  CharacterHeroCard,
  CharacterTitle,
  CharacterScene,
  hasHeroCard,
  hasPortrait,
  hasTitle,
  hasScene
} from '@/components/decor/CharacterPortrait';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle } from '@/components/decor/Squiggle';

export function generateStaticParams() {
  return allCharacters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCharacter(slug);
  return { title: c?.name ?? 'Character' };
}

export default async function CharacterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacter(slug);
  if (!character) notFound();

  const quotes = getQuotesByCharacter(slug);
  const others = allCharacters.filter((c) => c.slug !== slug).slice(0, 6);

  return (
    <div>
      {/* Header with portrait */}
      <section className="bg-paper px-6 pt-36 pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/universe/characters"
            className="text-xs font-display uppercase tracking-wider text-ink/60 hover:text-terracotta"
          >
            ← All characters
          </Link>

          <div className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_1fr]">
            <div>
              <Sticker color="mustard" rotate={-3}>
                A motion
              </Sticker>
              {hasTitle(slug) ? (
                <div className="mt-6">
                  <CharacterTitle slug={slug} name={character.name} className="w-full max-w-md" />
                </div>
              ) : (
                <h1 className="mt-6 font-display text-[clamp(4rem,12vw,10rem)] leading-none">
                  <span className="display-offset">{character.name}</span>
                </h1>
              )}
              {character.bio ? (
                <RevealOnView
                  delay={0.2}
                  className="mt-10 max-w-prose whitespace-pre-line text-lg text-ink/80"
                >
                  <p>{character.bio}</p>
                </RevealOnView>
              ) : (
                <RevealOnView delay={0.2} className="mt-10 max-w-prose text-lg text-ink/80">
                  <p>
                    {character.name} lives in Mo Town. Their long-form profile is being
                    written — the {character.quoteCount} quotes below are the canon for now.
                  </p>
                </RevealOnView>
              )}
            </div>

            <RevealOnView delay={0.15} className="relative">
              {hasHeroCard(slug) ? (
                <div className="overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg">
                  <CharacterHeroCard
                    slug={slug}
                    name={character.name}
                    priority
                    className="h-auto w-full"
                  />
                </div>
              ) : hasPortrait(slug) ? (
                <div className="relative aspect-square animate-bobble">
                  <div className="absolute inset-0 rounded-full bg-mustard border-3 border-ink shadow-cartoon-lg" />
                  <CharacterPortrait
                    slug={slug}
                    name={character.name}
                    size={520}
                    priority
                    className="relative h-full w-full object-contain p-6"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-3xl border-3 border-ink bg-mustard shadow-cartoon-lg">
                  <span className="font-display text-9xl text-ink">
                    {character.name.charAt(0)}
                  </span>
                </div>
              )}
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* Scene */}
      {hasScene(slug) && (
        <section className="relative bg-teal-grain">
          <Squiggle className="h-6 w-full" color="#f7c948" />
          <div className="mx-auto max-w-5xl px-6 py-16">
            <CharacterScene
              slug={slug}
              name={character.name}
              className="w-full rounded-3xl border-3 border-ink shadow-cartoon-lg"
            />
            <p className="mt-4 text-center font-editorial italic text-cream/80">
              Where {character.name} lives.
            </p>
          </div>
        </section>
      )}

      {/* Quotes */}
      <section className="bg-paper px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Sticker color="terracotta" rotate={-2}>
            From {character.name}
          </Sticker>
          <ul className="mt-10 space-y-5">
            {quotes.map((q, i) => (
              <RevealOnView key={q.id}>
                <li
                  className={`rounded-3xl border-3 border-ink p-8 shadow-cartoon ${
                    i % 2 === 0 ? 'bg-cream' : 'bg-mustard'
                  }`}
                >
                  <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
                    &ldquo;{q.text}&rdquo;
                  </p>
                </li>
              </RevealOnView>
            ))}
          </ul>
        </div>
      </section>

      {/* More */}
      <section className="bg-teal text-cream px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 font-display text-mustard text-xs uppercase tracking-[0.3em]">
            More motions
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/universe/characters/${o.slug}`}
                  className="block rounded-2xl border-3 border-cream/30 bg-teal-700 p-4 text-center font-display text-2xl text-cream transition-colors hover:border-mustard hover:text-mustard"
                >
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
