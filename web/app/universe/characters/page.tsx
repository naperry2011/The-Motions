import Link from 'next/link';
import { allCharacters } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { CharacterPortrait } from '@/components/decor/CharacterPortrait';
import { Sticker } from '@/components/decor/Sticker';

export const metadata = { title: 'Characters' };

export default function CharactersPage() {
  return (
    <div className="bg-paper px-6 pt-36 pb-28">
      <section className="mx-auto max-w-7xl">
        <Sticker color="mustard" rotate={-3}>
          The Mo Town Cast
        </Sticker>
        <h1 className="mt-6 font-display text-6xl leading-[0.95] md:text-7xl">
          <span className="display-offset">The twenty-five.</span>
        </h1>
        <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
          <p>
            Each character is a motion — a way solopreneur work moves through us. Click any
            one to read their quotes and what corrupts them.
          </p>
        </RevealOnView>
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {allCharacters.map((c, i) => (
          <RevealOnView key={c.slug} delay={(i % 10) * 0.04}>
            <Link
              href={`/universe/characters/${c.slug}`}
              className="group block overflow-hidden rounded-3xl border-3 border-ink bg-cream shadow-cartoon transition-transform hover:-translate-y-1 hover:rotate-[-0.6deg]"
            >
              <div className={`aspect-square ${i % 3 === 0 ? 'bg-mustard' : i % 3 === 1 ? 'bg-cream' : 'bg-terracotta/30'}`}>
                <CharacterPortrait
                  slug={c.slug}
                  name={c.name}
                  size={320}
                  className="h-full w-full object-contain p-3"
                />
              </div>
              <div className="border-t-3 border-ink px-4 py-3">
                <p className="font-display text-xl leading-none">{c.name}</p>
                <p className="mt-2 text-xs text-ink/60">{c.quoteCount} quotes →</p>
              </div>
            </Link>
          </RevealOnView>
        ))}
      </section>
    </div>
  );
}
