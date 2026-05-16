import { exacerbatorsDoc } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';
import { ChainSection } from '@/components/universe/ChainSection';

export const metadata = { title: 'Exacerbators' };

export default function ExacerbatorsPage() {
  const chains = exacerbatorsDoc.chains ?? [];

  return (
    <div>
      {/* HERO */}
      <section className="bg-paper px-5 pt-28 pb-10 sm:px-6 sm:pt-36 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <Sticker color="mustard" rotate={-3}>
            Corruption Map
          </Sticker>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:mt-6 sm:text-6xl md:text-7xl">
            <span className="display-offset">{exacerbatorsDoc.title}</span>
          </h1>
          <RevealOnView delay={0.2} className="mt-6 max-w-prose text-base leading-relaxed text-ink/80 sm:text-lg">
            <p>
              The Exacerbators are Capital&apos;s crew — charm, control, and chaos.
              Each one finds the motions whose shadow state they can exploit. Tap any
              tile to read how the trap is set.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* CHAINS — alternating cream / teal-grain bands */}
      {chains.map((chain, idx) => {
        const isDark = idx % 2 === 1;
        const bg = isDark ? 'bg-teal-grain text-cream' : 'bg-paper';
        return (
          <section key={chain.exacerbatorSlug} className={bg}>
            {isDark && <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />}
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
              <RevealOnView>
                <ChainSection chain={chain} isDark={isDark} />
              </RevealOnView>
            </div>
            {isDark && <Zigzag className="h-5 w-full rotate-180 sm:h-6" color="#f7c948" />}
          </section>
        );
      })}

      {/* CLOSING */}
      <section className="bg-paper px-5 py-14 sm:px-6 sm:py-20">
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
