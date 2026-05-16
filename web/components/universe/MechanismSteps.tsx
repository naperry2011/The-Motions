import type { MechanismStep } from '@/lib/content';

// Color order maps the journey: shadow-terracotta → grounded-teal
const STEP_TINTS: Record<string, string> = {
  Recognition: 'bg-terracotta/15 border-terracotta text-ink',
  Connection: 'bg-mustard border-ink text-ink',
  Practice: 'bg-mustard border-ink text-ink',
  Setback: 'bg-ink border-ink text-cream',
  Integration: 'bg-teal border-ink text-cream'
};

export function MechanismSteps({ steps }: { steps: MechanismStep[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
      {steps.map((s, i) => {
        const tint = STEP_TINTS[s.step] ?? 'bg-cream border-ink text-ink';
        return (
          <li
            key={s.step}
            className={`relative rounded-3xl border-3 p-5 shadow-cartoon-sm ${tint}`}
          >
            <span className="absolute -top-3 left-4 inline-flex h-6 items-center rounded-full border-3 border-ink bg-cream px-2 font-display text-[10px] uppercase tracking-wider text-ink shadow-cartoon-sm">
              Step 0{i + 1}
            </span>
            <p className="mt-2 font-display text-xl leading-tight">{s.step}</p>
            <p className="mt-3 text-sm leading-snug opacity-90">{s.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
