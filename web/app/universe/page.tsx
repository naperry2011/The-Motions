import Link from 'next/link';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { allCharacters } from '@/lib/content';
import { Sticker } from '@/components/decor/Sticker';

const tiles = [
  {
    href: '/universe/characters',
    title: 'Characters',
    desc: 'The twenty-five who live the motions — Quake, Drift, Pilot, Polish, and the rest.',
    bg: 'bg-mustard'
  },
  {
    href: '/universe/geography',
    title: 'Geography & Housing',
    desc: 'The districts of Mo Town and who lives where.',
    bg: 'bg-cream'
  },
  {
    href: '/universe/arcs',
    title: 'Arcs & Transformations',
    desc: 'How each character changes when they meet their motion on purpose.',
    bg: 'bg-terracotta/30'
  },
  {
    href: '/universe/exacerbators',
    title: 'Exacerbators',
    desc: 'Specific exacerbator → motion corruption interactions.',
    bg: 'bg-cream'
  },
  {
    href: '/universe/lore',
    title: 'Universe Lore',
    desc: 'How Mo Town connects to the client work it was built to hold.',
    bg: 'bg-mustard'
  },
  {
    href: '/quotes',
    title: 'The 250',
    desc: 'Every quote, every speaker, searchable.',
    bg: 'bg-terracotta/30'
  }
];

export default function UniversePage() {
  return (
    <div className="bg-paper px-6 pt-36 pb-28">
      <section className="mx-auto max-w-7xl">
        <Sticker color="terracotta" rotate={-4}>
          The Universe
        </Sticker>
        <h1 className="mt-6 font-display text-[clamp(4rem,12vw,12rem)] leading-none">
          <span className="display-offset">Mo Town.</span>
        </h1>
        <RevealOnView delay={0.3} className="mt-10 max-w-2xl text-lg text-ink/80">
          <p>
            A town built to hold the motions a solopreneur moves through — the trembles, the
            drifts, the bossy boots, the polish — so they have somewhere to live other than
            your nervous system.
          </p>
        </RevealOnView>
      </section>

      <section className="mx-auto mt-20 max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <RevealOnView key={t.href} delay={i * 0.06}>
              <Link
                href={t.href}
                className={`group block h-full rounded-3xl border-3 border-ink p-8 shadow-cartoon transition-transform hover:-translate-y-1 hover:rotate-[-0.4deg] ${t.bg}`}
              >
                <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                  Enter
                </p>
                <p className="mt-6 font-display text-3xl text-ink">{t.title}</p>
                <p className="mt-4 text-sm text-ink/70">{t.desc}</p>
                <p className="mt-8 font-display text-xs uppercase tracking-wider text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
                  Walk in →
                </p>
              </Link>
            </RevealOnView>
          ))}
        </div>

        <p className="mt-16 font-display text-sm text-ink/70">
          {allCharacters.length} characters · 250 quotes · 8 workbook modules
        </p>
      </section>
    </div>
  );
}
