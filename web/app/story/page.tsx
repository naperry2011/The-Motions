import Link from 'next/link';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';

export const metadata = {
  title: 'The Motions Story — why this exists',
  description:
    'The origin of The Motions, the psychology behind it, and how it connects to the Heart+Structure Method.'
};

export default function StoryPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-paper px-5 pt-28 pb-14 sm:px-6 sm:pt-36 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <Sticker color="teal" rotate={-3}>
            The Story
          </Sticker>
          <h1 className="mt-5 font-display text-4xl leading-[0.95] sm:mt-6 sm:text-5xl md:text-7xl">
            <span className="display-offset">Why</span>
            <br />
            <span className="font-editorial italic text-teal">The Motions</span>
            <br />
            <span className="display-offset">exists.</span>
          </h1>
          <RevealOnView delay={0.2} className="mt-8 max-w-prose text-lg text-ink/80">
            <p>
              The lived experience that built Mo Town, the psychology underneath it, and
              how it connects to the Heart+Structure Method.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* ── 1. THE ORIGIN ── */}
      <section className="bg-paper px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <RevealOnView>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-terracotta">
              The Origin
            </p>
            <p className="mt-6 font-editorial text-3xl italic leading-snug text-ink sm:text-4xl">
              I created these characters because I needed a map.
            </p>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/85 sm:text-lg">
              <p>
                The Motions started as a personal mapping tool — a way of making the
                emotional and psychological friction of entrepreneurship visible and
                nameable. I needed to know what I was actually feeling on a given day. Not
                in therapy language. Not in mindset-coach language. In real, specific,
                this-is-what-I-am-right-now language.
              </p>
              <p>
                So I started naming what kept showing up. The tremble before a decision
                lands. The drift of a week where nothing has wind. The over-polish of a
                page that&apos;s already done. Each one became a character, then a pair,
                then a town.
              </p>
              <p>
                The Motions came out of the specific kind of identity compression that
                happens when you&apos;re building something while also becoming someone.
                It&apos;s the inner map I wished I&apos;d had. This is that map.
              </p>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* ── 2. THE PSYCHOLOGY ── */}
      <section className="relative bg-teal-grain text-cream">
        <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-6 sm:py-28">
          <RevealOnView>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-mustard">
              The Psychology
            </p>
            <p className="mt-6 font-editorial text-3xl italic leading-snug text-mustard sm:text-4xl">
              This isn&apos;t therapy. It&apos;s what happens when therapy meets your
              business.
            </p>
          </RevealOnView>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
            <RevealOnView delay={0.1}>
              <div className="rounded-3xl border-3 border-cream/30 bg-teal-700 p-6 sm:p-8">
                <p className="font-display text-xs uppercase tracking-wider text-mustard">
                  Internal Family Systems
                </p>
                <p className="mt-4 text-base leading-relaxed text-cream/85 sm:text-lg">
                  The Motions draws from Internal Family Systems — the understanding that
                  we contain multiple parts, each with their own voice, history, and need.
                  The characters are those parts made visible and named.
                </p>
              </div>
            </RevealOnView>
            <RevealOnView delay={0.2}>
              <div className="rounded-3xl border-3 border-cream/30 bg-teal-700 p-6 sm:p-8">
                <p className="font-display text-xs uppercase tracking-wider text-mustard">
                  DBT + Lived Experience
                </p>
                <p className="mt-4 text-base leading-relaxed text-cream/85 sm:text-lg">
                  The framework is also informed by DBT principles around emotional
                  regulation and behavioral pattern recognition. Not as a clinical
                  application — as a lived one. This is what the work looks like when
                  you&apos;re using it on yourself in real time.
                </p>
              </div>
            </RevealOnView>
          </div>
        </div>
        <Zigzag className="h-5 w-full rotate-180 sm:h-6" color="#f7c948" />
      </section>

      {/* ── 3. HEART+STRUCTURE METHOD ── */}
      <section className="bg-paper px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <RevealOnView>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-terracotta">
              How It Connects
            </p>
            <h2 className="mt-6 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              <span className="display-offset">The Motions</span>
              <br />
              <span className="font-editorial italic text-teal">
                is the inner map.
              </span>
              <br />
              <span className="display-offset">The Heart+Structure Method</span>
              <br />
              <span className="font-editorial italic text-teal">
                is how you move through it.
              </span>
            </h2>
          </RevealOnView>

          <ol className="mt-12 space-y-4">
            {[
              {
                step: 'Get Calm',
                body: "Identifying which motions are active. Naming what's present."
              },
              {
                step: 'Get Clear',
                body: 'Understanding the pairing — what the shadow state is signaling, what the grounded state offers.'
              },
              {
                step: 'Get in Motion',
                body: 'Using the workbook to take intentional action from that clarity.'
              }
            ].map((s, i) => (
              <RevealOnView key={s.step} delay={i * 0.08}>
                <li
                  className={`flex gap-5 rounded-3xl border-3 border-ink p-5 shadow-cartoon-sm sm:gap-7 sm:p-7 ${
                    i % 2 === 0 ? 'bg-cream' : 'bg-mustard'
                  } ${i % 2 === 0 ? '-rotate-[0.3deg]' : 'rotate-[0.3deg]'}`}
                >
                  <p className="font-display text-3xl text-terracotta sm:text-4xl">
                    0{i + 1}
                  </p>
                  <div>
                    <p className="font-display text-xl text-ink sm:text-2xl">
                      {s.step}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-base">
                      {s.body}
                    </p>
                  </div>
                </li>
              </RevealOnView>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTAs ── */}
      <section className="bg-ink px-5 py-20 text-cream sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-editorial text-2xl italic leading-snug text-cream/90 sm:text-3xl">
            Not sure which motion is showing up for you right now?
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/quiz"
              className="rounded-full border-3 border-cream bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon transition-transform hover:-translate-y-1"
            >
              Find your motion →
            </Link>
            <Link
              href="/universe/characters"
              className="rounded-full border-3 border-cream bg-transparent px-6 py-3 text-xs font-display uppercase tracking-wider text-cream transition-transform hover:-translate-y-1"
            >
              Meet the cast
            </Link>
            <Link
              href="/workbook"
              className="rounded-full border-3 border-cream bg-transparent px-6 py-3 text-xs font-display uppercase tracking-wider text-cream transition-transform hover:-translate-y-1"
            >
              The workbook
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
