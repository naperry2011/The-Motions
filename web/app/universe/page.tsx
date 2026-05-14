import Link from 'next/link';
import { TextReveal } from '@/components/motion/TextReveal';
import { RevealOnView } from '@/components/motion/RevealOnView';
import { allCharacters } from '@/lib/content';

const tiles = [
  {
    href: '/universe/characters',
    title: 'Characters',
    desc: 'The twenty-five who live the motions — Quake, Drift, Pilot, Polish, and the rest.',
    accent: 'text-motion-quake'
  },
  {
    href: '/universe/geography',
    title: 'Geography & Housing',
    desc: 'The districts of Mo Town and who lives where.',
    accent: 'text-motion-drift'
  },
  {
    href: '/universe/arcs',
    title: 'Arcs & Transformations',
    desc: 'How each character changes when they meet their motion on purpose.',
    accent: 'text-motion-spiral'
  },
  {
    href: '/universe/exacerbators',
    title: 'Exacerbators',
    desc: 'Specific exacerbator → motion corruption interactions.',
    accent: 'text-motion-spark'
  },
  {
    href: '/universe/lore',
    title: 'Universe Lore',
    desc: 'How Mo Town connects to the client work it was built to hold.',
    accent: 'text-ember-400'
  },
  {
    href: '/quotes',
    title: 'The 250',
    desc: 'Every quote, every speaker, searchable.',
    accent: 'text-motion-fog'
  }
];

export default function UniversePage() {
  return (
    <div className="px-6 pt-40">
      <section className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-ember-400">The Universe</p>
        <TextReveal
          as="h1"
          text="Mo Town."
          className="font-display text-[clamp(4rem,12vw,12rem)] leading-none"
        />
        <RevealOnView delay={0.3} className="mt-10 max-w-2xl text-lg text-ink-100">
          <p>
            A town built to hold the motions a solopreneur moves through — the trembles, the
            drifts, the bossy boots, the polish — so they have somewhere to live other than
            your nervous system.
          </p>
        </RevealOnView>
      </section>

      <section className="mx-auto mt-24 max-w-7xl pb-32">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <RevealOnView key={t.href} delay={i * 0.06}>
              <Link
                href={t.href}
                className="group block h-full rounded-3xl border border-ink-600 bg-ink-800/50 p-8 transition-colors hover:border-ember-400"
              >
                <p
                  className={`text-xs uppercase tracking-[0.4em] ${t.accent}`}
                >
                  Enter
                </p>
                <p className="mt-6 font-display text-3xl">{t.title}</p>
                <p className="mt-4 text-sm text-ink-200">{t.desc}</p>
                <p className="mt-8 text-xs uppercase tracking-widest text-ember-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Walk in →
                </p>
              </Link>
            </RevealOnView>
          ))}
        </div>

        <p className="mt-16 text-sm text-ink-300">
          {allCharacters.length} characters · 250 quotes · 8 workbook modules
        </p>
      </section>
    </div>
  );
}
