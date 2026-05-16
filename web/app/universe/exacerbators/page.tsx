import Link from 'next/link';
import { exacerbatorsDoc } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';
import {
  CharacterHeroCard,
  CharacterPortrait,
  hasHeroCard
} from '@/components/decor/CharacterPortrait';
import { CorruptionRow } from '@/components/universe/CorruptionRow';

export const metadata = { title: 'Exacerbators' };

export default function ExacerbatorsPage() {
  const chains = exacerbatorsDoc.chains ?? [];

  return (
    <div>
      {/* HERO */}
      <section className="bg-paper px-5 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <Sticker color="mustard" rotate={-3}>
            Corruption Map
          </Sticker>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:mt-6 sm:text-6xl md:text-7xl">
            <span className="display-offset">{exacerbatorsDoc.title}</span>
          </h1>
          <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg leading-relaxed text-ink/80">
            <p>
              The Exacerbators are the corrupting force inside Mo Town — Capital&apos;s
              crew of charm, control, and chaos. Each one finds the motions whose
              shadow state they can exploit, and turns helpful into harmful.
            </p>
            <p className="mt-4">
              Below: every documented corruption — who meets whom, what they offer
              as the trap, what sweetens the deal, and where it leads.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* CHAINS — one band per Exacerbator */}
      <section className="bg-paper">
        {chains.map((chain, idx) => {
          const isDark = idx % 2 === 1;
          const bg = isDark ? 'bg-teal-grain text-cream' : 'bg-paper';
          return (
            <section key={chain.exacerbatorSlug} className={bg}>
              {isDark && (
                <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
              )}
              <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
                {/* Header band */}
                <RevealOnView>
                  <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
                    <Link
                      href={`/universe/characters/${chain.exacerbatorSlug}`}
                      className="group relative inline-block w-40 overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg sm:w-56"
                    >
                      {hasHeroCard(chain.exacerbatorSlug) ? (
                        <CharacterHeroCard
                          slug={chain.exacerbatorSlug}
                          name={chain.exacerbatorName}
                          className="h-auto w-full"
                        />
                      ) : (
                        <CharacterPortrait
                          slug={chain.exacerbatorSlug}
                          name={chain.exacerbatorName}
                          size={224}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </Link>
                    <div>
                      <Sticker color={isDark ? 'mustard' : 'terracotta'} rotate={-3}>
                        Exacerbator
                      </Sticker>
                      <h2 className="mt-4 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
                        <span className={isDark ? 'display-offset-light' : 'display-offset'}>
                          {chain.exacerbatorName}&apos;s
                        </span>
                        <br />
                        <span className="font-editorial italic text-terracotta">
                          corruptions.
                        </span>
                      </h2>
                      <p
                        className={`mt-4 font-display text-xs uppercase tracking-wider ${
                          isDark ? 'text-mustard' : 'text-terracotta'
                        }`}
                      >
                        {chain.interactions.length} documented victims
                      </p>
                    </div>
                  </div>
                </RevealOnView>

                {/* Interactions */}
                <ul className="mt-10 space-y-6 sm:mt-14 sm:space-y-8">
                  {chain.interactions.map((it, i) => (
                    <li key={`${chain.exacerbatorSlug}-${it.victimSlug}`}>
                      <RevealOnView delay={i * 0.04}>
                        <CorruptionRow
                          exacerbatorSlug={chain.exacerbatorSlug}
                          exacerbatorName={chain.exacerbatorName}
                          interaction={it}
                        />
                      </RevealOnView>
                    </li>
                  ))}
                </ul>
              </div>
              {isDark && (
                <Zigzag className="h-5 w-full rotate-180 sm:h-6" color="#f7c948" />
              )}
            </section>
          );
        })}
      </section>

      {/* CLOSING */}
      <section className="bg-paper px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Sticker color="terracotta" rotate={2}>
            One Town, Many Hooks
          </Sticker>
          <p className="mt-6 font-editorial text-xl italic leading-snug text-ink/85 sm:text-2xl">
            Every motion has a soft spot. The Exacerbators are the ones who&apos;ve
            mapped them. Knowing the trap is the first step to walking past it.
          </p>
        </div>
      </section>
    </div>
  );
}
