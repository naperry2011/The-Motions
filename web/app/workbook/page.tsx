import { allModules } from '@/lib/content';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { WaitlistForm } from '@/components/ui/WaitlistForm';

export const metadata = {
  title: 'Going Through the Motions — the workbook',
  description:
    'An eight-module, 216-path workbook for solopreneurs whose work has shape but no rhythm yet.'
};

export default function WorkbookPage() {
  return (
    <div className="pt-40">
      <section className="px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-ember-400">The Workbook</p>
          <TextReveal
            as="h1"
            text="Going Through the Motions."
            className="font-display text-5xl leading-tight md:text-7xl"
          />
          <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink-100">
            <p>
              A solopreneur&apos;s brand companion. Eight modules. Twenty-seven paths each.
              Built for the work that has shape — but hasn&apos;t found its rhythm yet.
            </p>
          </RevealOnView>
          <RevealOnView delay={0.35} className="mt-10">
            <a
              href="#waitlist"
              className="inline-block rounded-full bg-ember-500 px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-900 hover:bg-ember-400"
            >
              Join the waitlist
            </a>
          </RevealOnView>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-xs uppercase tracking-[0.4em] text-motion-drift">
            The eight modules
          </p>
          <ol className="space-y-4">
            {allModules.map((m, i) => (
              <RevealOnView key={m.number} delay={i * 0.05}>
                <li className="rounded-3xl border border-ink-700 bg-ink-800/40 p-8 md:flex md:items-center md:justify-between md:gap-8">
                  <div>
                    <p className="font-display text-2xl text-ember-400">
                      Module {String(m.number).padStart(2, '0')}
                    </p>
                    <p className="mt-2 font-display text-3xl text-ink-50">{m.title}</p>
                  </div>
                  <p className="mt-4 text-sm text-ink-200 md:mt-0">
                    {m.paths.length} paths · activities included
                  </p>
                </li>
              </RevealOnView>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-ink-700/60 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-motion-spark">
            What you get
          </p>
          <ul className="grid gap-6 md:grid-cols-2">
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
              <li key={t} className="rounded-2xl border border-ink-700 p-6">
                <p className="font-display text-xl text-ink-50">{t}</p>
                <p className="mt-2 text-sm text-ink-200">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="waitlist"
        className="border-t border-ink-700/60 bg-gradient-to-b from-ink-900 to-ink-800 px-6 py-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <TextReveal
            as="h2"
            text="Be first when it ships."
            className="font-display text-4xl md:text-5xl"
          />
          <RevealOnView delay={0.2} className="mt-6 text-ink-100">
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
