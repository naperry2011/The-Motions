import { allQuotes, allCharacters } from '@/lib/content';
import { QuoteLibrary } from '@/components/quotes/QuoteLibrary';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';

export const metadata = { title: 'The 250 quotes' };

export default function QuotesPage() {
  return (
    <div className="px-6 pt-40 pb-32">
      <section className="mx-auto mb-16 max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-ember-400">The 250</p>
        <TextReveal
          as="h1"
          text="Every quote, every motion."
          className="font-display text-5xl md:text-7xl"
        />
        <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink-100">
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
