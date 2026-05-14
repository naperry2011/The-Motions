import Link from 'next/link';
import { allCharacters } from '@/lib/content';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';

export const metadata = { title: 'Characters' };

export default function CharactersPage() {
  return (
    <div className="px-6 pt-40 pb-32">
      <section className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-ember-400">
          The Mo Town Cast
        </p>
        <TextReveal
          as="h1"
          text="The twenty-five."
          className="font-display text-6xl md:text-7xl"
        />
        <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink-100">
          <p>
            Each character is a motion: a way solopreneur work moves through us. Click any
            one to read their quotes and what corrupts them.
          </p>
        </RevealOnView>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {allCharacters.map((c, i) => (
          <RevealOnView key={c.slug} delay={(i % 10) * 0.04}>
            <Link
              href={`/universe/characters/${c.slug}`}
              className="group block aspect-[3/4] overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/50 p-5 transition-colors hover:border-ember-400"
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
      </section>
    </div>
  );
}
