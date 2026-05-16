import { allModules } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';

export const metadata = {
  title: 'Going Through the Motions — the workbook',
  description:
    "A solopreneur's brand companion. Eight modules. Character-led. Motion-mapped."
};

// Pretty titles per audit (modules.json stores camelcase + "27Paths" suffix).
const MODULE_TITLES: Record<number, string> = {
  2: 'Inner Compass',
  3: 'Safe Runway',
  4: 'Progress Over Perfect',
  5: 'True And Seen',
  6: 'Message Market Fit',
  7: 'Offer Architecture',
  8: 'Rhythm Systems',
  9: 'Proof & Performance'
};

export default function WorkbookPage() {
  return (
    <div>
      {/* ── HERO + LEAD MAGNET (above the fold) ── */}
      <section className="bg-paper px-5 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div>
            <Sticker color="mustard" rotate={-3}>
              The Workbook
            </Sticker>
            <h1 className="mt-5 font-display text-4xl leading-[0.95] sm:mt-6 sm:text-5xl md:text-7xl">
              <span className="display-offset">Going Through</span>
              <br />
              <span className="display-offset">the Motions.</span>
            </h1>
            <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
              <p>
                A solopreneur&apos;s brand companion. Eight modules. Character-led.
                Motion-mapped.
              </p>
            </RevealOnView>
          </div>

          <RevealOnView delay={0.15}>
            <div className="rounded-3xl border-3 border-ink bg-mustard p-6 shadow-cartoon-lg sm:p-8">
              <Sticker color="terracotta" rotate={3}>
                Free
              </Sticker>
              <p className="mt-5 font-display text-3xl leading-tight text-ink sm:text-4xl">
                Get Module 01,
                <br />
                <span className="font-editorial italic text-terracotta">on us.</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/80 sm:text-base">
                Drop your email and we&apos;ll send Module 01 — the first step into Mo Town
                — straight to your inbox.
              </p>
              <div className="mt-6">
                <WaitlistForm
                  source="workbook-leadmagnet"
                  buttonLabel="Send Module 01"
                  successMessage="On its way — check your inbox."
                />
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* ── MODULE LIST (names only) ── */}
      <section className="bg-paper px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 font-display text-xs uppercase tracking-wider text-terracotta sm:mb-10">
            The eight modules
          </p>
          <ol className="space-y-3 sm:space-y-4">
            {allModules.map((m, i) => {
              const title = MODULE_TITLES[m.number] ?? m.title;
              return (
                <RevealOnView key={m.number} delay={i * 0.05}>
                  <li
                    className={`rounded-3xl border-3 border-ink p-5 shadow-cartoon-sm md:flex md:items-baseline md:gap-8 md:p-7 ${
                      i % 2 === 0 ? 'bg-cream' : 'bg-mustard'
                    } ${i % 2 === 0 ? '-rotate-[0.3deg]' : 'rotate-[0.3deg]'}`}
                  >
                    <p className="font-display text-xl text-terracotta sm:text-2xl">
                      M{String(m.number).padStart(2, '0')}
                    </p>
                    <p className="mt-1 font-display text-2xl text-ink sm:mt-0 sm:text-3xl">
                      {title}
                    </p>
                  </li>
                </RevealOnView>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── WAITLIST (full access · cohorts · early pricing) ── */}
      <section
        id="waitlist"
        className="relative bg-teal-grain text-cream"
      >
        <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-6 sm:py-28">
          <Sticker color="mustard" rotate={3}>
            Waitlist
          </Sticker>
          <h2 className="mt-6 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
            <span className="display-offset-light">Be first</span>
            <br />
            <span className="font-editorial italic">when it ships.</span>
          </h2>
          <RevealOnView delay={0.2} className="mt-6 text-cream/80">
            <p>
              For full workbook access, guided cohorts, and early pricing — join the
              waitlist.
            </p>
          </RevealOnView>
          <RevealOnView delay={0.3} className="mt-10 flex justify-center">
            <WaitlistForm source="workbook" />
          </RevealOnView>
        </div>
        <Zigzag className="h-6 w-full rotate-180" color="#f7c948" />
      </section>
    </div>
  );
}
