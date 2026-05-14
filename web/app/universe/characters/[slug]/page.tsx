import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allCharacters, getCharacter, getQuotesByCharacter } from '@/lib/content';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';

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
    <div className="pt-40">
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/universe/characters"
            className="text-xs uppercase tracking-[0.3em] text-ink-300 hover:text-ember-400"
          >
            ← All characters
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.4em] text-ember-400">A motion</p>
          <TextReveal
            as="h1"
            text={character.name}
            className="font-display text-[clamp(4rem,14vw,14rem)] leading-none"
          />
          {character.bio ? (
            <RevealOnView
              delay={0.2}
              className="mt-12 max-w-prose whitespace-pre-line text-lg text-ink-100"
            >
              <p>{character.bio}</p>
            </RevealOnView>
          ) : (
            <RevealOnView delay={0.2} className="mt-12 max-w-prose text-lg text-ink-100">
              <p>
                {character.name} lives in Mo Town. Their long-form profile is being written —
                the {character.quoteCount} quotes below are the canon for now.
              </p>
            </RevealOnView>
          )}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs uppercase tracking-[0.4em] text-motion-spark">
            From {character.name}
          </p>
          <ul className="space-y-6">
            {quotes.map((q) => (
              <RevealOnView key={q.id}>
                <li className="rounded-3xl border border-ink-700 bg-ink-800/50 p-8">
                  <p className="font-display text-2xl leading-snug text-ink-50 md:text-3xl">
                    &ldquo;{q.text}&rdquo;
                  </p>
                </li>
              </RevealOnView>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink-700/60 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs uppercase tracking-[0.4em] text-ember-400">
            More motions
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/universe/characters/${o.slug}`}
                  className="block rounded-2xl border border-ink-600 p-4 text-center transition-colors hover:border-ember-400"
                >
                  <span className="font-display text-2xl">{o.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
