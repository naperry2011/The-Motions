import fs from 'node:fs';
import path from 'node:path';
import { allQuotes, allCharacters } from '@/lib/content';
import { QuoteLibrary } from '@/components/quotes/QuoteLibrary';
import { Sticker } from '@/components/decor/Sticker';

export const metadata = { title: 'The 250 quotes' };

function loadQuotePostIds(): number[] {
  try {
    const dir = path.join(process.cwd(), 'public/assets/quote-posts');
    return fs
      .readdirSync(dir)
      .map((f) => Number(f.replace(/\.webp$/, '')))
      .filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

export default function QuotesPage() {
  const quotePostIds = loadQuotePostIds();
  return (
    <div className="bg-paper px-5 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
      <section className="mx-auto mb-8 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sticker color="terracotta" rotate={-3}>
              The 250
            </Sticker>
            <h1 className="mt-4 font-display text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
              <span className="display-offset">Every quote,</span>{' '}
              <span className="font-editorial italic">every motion.</span>
            </h1>
          </div>
          <p className="max-w-sm text-sm text-ink/70">
            250 quotes · 25 characters · {quotePostIds.length} ship with designed
            posters. Tap any card to open it full size.
          </p>
        </div>
      </section>

      <QuoteLibrary
        quotes={allQuotes}
        characters={allCharacters}
        quotePostIds={quotePostIds}
      />
    </div>
  );
}
