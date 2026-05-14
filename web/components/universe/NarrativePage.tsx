import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';
import type { NarrativeDoc } from '@/lib/content';

export function NarrativePage({
  eyebrow,
  doc,
  accent = 'text-ember-400'
}: {
  eyebrow: string;
  doc: NarrativeDoc;
  accent?: string;
}) {
  return (
    <div className="px-6 pt-40 pb-32">
      <section className="mx-auto max-w-3xl">
        <p className={`mb-6 text-xs uppercase tracking-[0.4em] ${accent}`}>{eyebrow}</p>
        <TextReveal as="h1" text={doc.title} className="font-display text-5xl md:text-6xl" />
        <RevealOnView delay={0.2} className="prose-motions mt-12">
          <div
            className="space-y-5 text-ink-100 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:text-ink-50 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink-50 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-ink-50 [&_strong]:text-ember-400 [&_a]:text-ember-400 [&_a]:underline [&_li]:list-disc [&_li]:ml-6 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </RevealOnView>
      </section>
    </div>
  );
}
