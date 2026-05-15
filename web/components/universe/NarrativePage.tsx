import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import type { NarrativeDoc } from '@/lib/content';

export function NarrativePage({
  eyebrow,
  doc,
  stickerColor = 'mustard'
}: {
  eyebrow: string;
  doc: NarrativeDoc;
  stickerColor?: 'mustard' | 'terracotta' | 'teal' | 'cream';
}) {
  return (
    <div className="bg-paper px-6 pt-36 pb-28">
      <article className="mx-auto max-w-3xl">
        <Sticker color={stickerColor} rotate={-3}>
          {eyebrow}
        </Sticker>
        <h1 className="mt-6 font-display text-5xl leading-[0.95] md:text-6xl">
          <span className="display-offset">{doc.title}</span>
        </h1>
        <RevealOnView delay={0.2} className="mt-12">
          <div
            className="space-y-5 text-lg text-ink/85 [&_h1]:mt-12 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:text-ink [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-ink [&_strong]:text-terracotta [&_a]:text-terracotta [&_a]:underline [&_li]:list-disc [&_li]:ml-6 [&_p]:leading-relaxed [&_em]:font-editorial [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </RevealOnView>
      </article>
    </div>
  );
}
