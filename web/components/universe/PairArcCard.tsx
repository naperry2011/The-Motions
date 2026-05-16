import Link from 'next/link';
import {
  CharacterHeroCard,
  CharacterPortrait,
  hasHeroCard
} from '@/components/decor/CharacterPortrait';
import type { PairArc } from '@/lib/content';

type Tint = 'cream' | 'mustard' | 'teal';

const STAGE_LABELS = [
  ['startingPoint', 'Starting Point', 'terracotta'],
  ['turningPoint', 'Turning Point', 'mustard'],
  ['thePractice', 'The Practice', 'mustard'],
  ['backslideMoment', 'Backslide Moment', 'terracotta']
] as const;

export function PairArcCard({
  arc,
  tint = 'cream',
  rotate = 0
}: {
  arc: PairArc;
  tint?: Tint;
  rotate?: number;
}) {
  const bgClass =
    tint === 'cream' ? 'bg-cream' : tint === 'mustard' ? 'bg-mustard' : 'bg-teal text-cream';
  const isDark = tint === 'teal';

  const textBody = isDark ? 'text-cream/85' : 'text-ink/85';
  const textKicker = isDark ? 'text-mustard' : 'text-terracotta';
  const innerCardBg = isDark
    ? 'bg-teal-700 border-cream/30'
    : 'bg-paper border-ink';

  return (
    <article
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg ${bgClass}`}
    >
      {/* Header — shadow ↔ grounded portraits */}
      <div className="grid items-center gap-4 border-b-3 border-ink p-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:p-6">
        <PortraitPanel
          slug={arc.shadowSlug}
          name={arc.shadowName}
          label="Shadow State"
          align="left"
          isDark={isDark}
        />
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-3 border-ink font-display text-2xl shadow-cartoon-sm sm:h-14 sm:w-14 sm:text-3xl ${
              isDark ? 'bg-mustard text-ink' : 'bg-terracotta text-cream'
            }`}
            aria-hidden
          >
            →
          </span>
        </div>
        <PortraitPanel
          slug={arc.groundedSlug}
          name={arc.groundedName}
          label="Grounded State"
          align="right"
          isDark={isDark}
        />
      </div>

      {/* Stages */}
      <div className="space-y-5 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {STAGE_LABELS.map(([key, label, color]) => {
            const value = arc[key];
            if (!value) return null;
            return (
              <div
                key={key}
                className={`rounded-2xl border-3 p-4 shadow-cartoon-sm sm:p-5 ${innerCardBg}`}
              >
                <p
                  className={`font-display text-[11px] uppercase tracking-wider ${
                    color === 'mustard' ? 'text-mustard' : 'text-terracotta'
                  } ${isDark ? '' : color === 'mustard' ? '!text-ink/70' : ''}`}
                >
                  {label}
                </p>
                <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-cream/85' : 'text-ink/85'}`}>
                  {value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Growth bullets */}
        {arc.growthBullets.length > 0 && (
          <div
            className={`rounded-2xl border-3 p-5 shadow-cartoon-sm sm:p-6 ${
              isDark ? 'bg-mustard border-ink text-ink' : 'bg-terracotta/15 border-ink'
            }`}
          >
            <p className="font-display text-xs uppercase tracking-wider text-terracotta">
              Growth looks like
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {arc.growthBullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-snug text-ink/85"
                >
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grounded's Role */}
        {arc.groundedRole && (
          <p className={`max-w-prose text-base leading-relaxed ${textBody}`}>
            <span className={`font-display text-xs uppercase tracking-wider ${textKicker}`}>
              {arc.groundedName}&apos;s role ·{' '}
            </span>
            {arc.groundedRole}
          </p>
        )}

        {/* Backslide outcome */}
        {arc.backslideOutcome && (
          <p className={`max-w-prose font-editorial text-base italic leading-relaxed ${textBody}`}>
            <span className={`font-display not-italic text-xs uppercase tracking-wider ${textKicker}`}>
              Will they backslide? ·{' '}
            </span>
            {arc.backslideOutcome}
          </p>
        )}
      </div>
    </article>
  );
}

function PortraitPanel({
  slug,
  name,
  label,
  align,
  isDark
}: {
  slug: string;
  name: string;
  label: string;
  align: 'left' | 'right';
  isDark: boolean;
}) {
  const textCls = isDark ? 'text-cream' : 'text-ink';
  const labelCls = isDark ? 'text-mustard' : 'text-terracotta';
  return (
    <Link
      href={`/universe/characters/${slug}`}
      className={`group flex items-center gap-3 ${align === 'right' ? 'sm:justify-end' : ''}`}
    >
      <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border-3 border-ink bg-mustard sm:h-20 sm:w-20">
        {hasHeroCard(slug) ? (
          <CharacterHeroCard
            slug={slug}
            name={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <CharacterPortrait
            slug={slug}
            name={name}
            size={80}
            className="h-full w-full object-cover"
          />
        )}
      </span>
      <div className={align === 'right' ? 'text-right' : ''}>
        <p
          className={`font-display text-[10px] uppercase tracking-wider ${labelCls}`}
        >
          {label}
        </p>
        <p className={`font-display text-2xl leading-none ${textCls} group-hover:text-terracotta sm:text-3xl`}>
          {name}
        </p>
      </div>
    </Link>
  );
}
