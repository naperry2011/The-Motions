import { allModules } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';

export const metadata = {
  title: 'Going Through the Motions — the workbook',
  description:
    'An eight-module, 216-path workbook for solopreneurs whose work has shape but no rhythm yet.'
};

export default function WorkbookPage() {
  return (
    <div>
      <section className="bg-paper px-6 pt-36 pb-20">
        <div className="mx-auto max-w-4xl">
          <Sticker color="mustard" rotate={-3}>
            The Workbook
          </Sticker>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
            <span className="display-offset">Going Through</span>
            <br />
            <span className="display-offset">the Motions.</span>
          </h1>
          <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
            <p>
              A solopreneur&apos;s brand companion. Eight modules. Twenty-seven paths each.
              Built for the work that has shape — but hasn&apos;t found its rhythm yet.
            </p>
          </RevealOnView>
          <RevealOnView delay={0.35} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#waitlist"
              className="inline-block rounded-full border-3 border-ink bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon hover:-translate-y-0.5 transition-transform"
            >
              Join the waitlist
            </a>
            <a
              href="/pdfs/sample-5min-light-page.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-3 border-ink bg-cream px-6 py-3 text-xs font-display uppercase tracking-wider text-ink shadow-cartoon-sm hover:-translate-y-0.5 transition-transform"
            >
              Download sample page ↓
            </a>
          </RevealOnView>
        </div>
      </section>

      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 font-display text-xs uppercase tracking-wider text-terracotta">
            The eight modules
          </p>
          <ol className="space-y-4">
            {allModules.map((m, i) => (
              <RevealOnView key={m.number} delay={i * 0.05}>
                <li
                  className={`rounded-3xl border-3 border-ink p-7 shadow-cartoon-sm md:flex md:items-center md:justify-between md:gap-8 ${
                    i % 2 === 0 ? 'bg-cream' : 'bg-mustard'
                  } ${i % 2 === 0 ? '-rotate-[0.3deg]' : 'rotate-[0.3deg]'}`}
                >
                  <div>
                    <p className="font-display text-2xl text-terracotta">
                      Module {String(m.number).padStart(2, '0')}
                    </p>
                    <p className="mt-2 font-display text-3xl text-ink">{m.title}</p>
                  </div>
                  <p className="mt-4 font-editorial italic text-ink/70 md:mt-0">
                    {m.paths.length} paths · activities included
                  </p>
                </li>
              </RevealOnView>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-teal-grain text-cream">
        <Squiggle className="h-6 w-full" color="#f7c948" />
        <div className="mx-auto max-w-3xl px-6 py-24">
          <Sticker color="mustard" rotate={-2}>
            What you get
          </Sticker>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              [
                'The full 216 paths',
                'Every prompt, every activity. Hand-built from the Mo Town universe.'
              ],
              [
                'Character-led practice',
                'Each module is taught through the motions that hold you back from doing it.'
              ],
              [
                '5-minute light pages',
                'Sample pages designed for the day you can only show up for five minutes.'
              ],
              [
                'Mo Town as a map',
                'Use the universe to locate where you are — and what motion to do next.'
              ]
            ].map(([t, d]) => (
              <li
                key={t}
                className="rounded-3xl border-3 border-cream/30 bg-teal-700 p-6"
              >
                <p className="font-display text-xl text-mustard">{t}</p>
                <p className="mt-2 text-sm text-cream/80">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <Zigzag className="h-6 w-full rotate-180" color="#f7c948" />
      </section>

      <section
        id="waitlist"
        className="bg-paper px-6 py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <Sticker color="terracotta" rotate={3}>
            Waitlist
          </Sticker>
          <h2 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
            <span className="display-offset">Be first</span>
            <br />
            <span className="font-editorial italic">when it ships.</span>
          </h2>
          <RevealOnView delay={0.2} className="mt-6 text-ink/80">
            <p>
              The workbook releases in stages. Waitlist members get the first chapter, early
              pricing, and access to the first cohort.
            </p>
          </RevealOnView>
          <RevealOnView delay={0.3} className="mt-10 flex justify-center">
            <WaitlistForm source="workbook" />
          </RevealOnView>
        </div>
      </section>
    </div>
  );
}
