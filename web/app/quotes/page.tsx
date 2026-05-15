import { allQuotes, allCharacters } from '@/lib/content';
import { QuoteLibrary } from '@/components/quotes/QuoteLibrary';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';

export const metadata = { title: 'The 250 quotes' };

export default function QuotesPage() {
  return (
    <div className="bg-paper px-6 pt-36 pb-28">
      <section className="mx-auto mb-12 max-w-7xl">
        <Sticker color="terracotta" rotate={-3}>
          The 250
        </Sticker>
        <h1 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
          <span className="display-offset">Every quote,</span>
          <br />
          <span className="font-editorial italic">every motion.</span>
        </h1>
        <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
          <p>
            Two hundred and fifty quotes across twenty-five characters. Filter by motion,
            search by phrase, or shuffle to land somewhere unexpected.
          </p>
        </RevealOnView>
      </section>

      <QuoteLibrary quotes={allQuotes} characters={allCharacters} />
    </div>
  );
}
