import Image from 'next/image';
import { Sticker } from '@/components/decor/Sticker';
import { CharacterChip } from '@/components/universe/CharacterChip';
import { hasScene } from '@/components/decor/CharacterPortrait';
import type { Borough } from '@/lib/content';

// Each borough → one resident's scene art as the accent visual.
// Chosen because that character's location anchors the borough geographically.
const BOROUGH_ACCENT_SLUG: Record<string, string> = {
  'the-heart': 'flow', // Flow City Park, central gathering
  'the-heights': 'north', // North Roof at the summit
  'the-lower-wards': 'guess', // Guess Market in the chaos
  'the-margins': 'shade', // Shade Street on the edges
  'the-campus': 'echo' // Echo Music Room at Mo U
};

type Tint = 'cream' | 'mustard' | 'paper-grain' | 'teal';

export function BoroughCard({
  borough,
  tint = 'cream',
  rotate = 0
}: {
  borough: Borough;
  tint?: Tint;
  rotate?: number;
}) {
  const accentSlug = BOROUGH_ACCENT_SLUG[borough.slug];
  const showScene = accentSlug && hasScene(accentSlug);

  const bgClass =
    tint === 'cream'
      ? 'bg-cream'
      : tint === 'mustard'
        ? 'bg-mustard'
        : tint === 'teal'
          ? 'bg-teal text-cream'
          : 'bg-paper';

  return (
    <article
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg ${bgClass}`}
    >
      {/* Accent scene image at the top */}
      {showScene && (
        <div className="relative aspect-[16/7] w-full overflow-hidden border-b-3 border-ink bg-ink">
          <Image
            src={`/assets/scenes/${accentSlug}.webp`}
            alt={`A scene from ${borough.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 sm:p-9">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <Sticker color={tint === 'mustard' ? 'terracotta' : 'mustard'} rotate={-3}>
              Borough {String(borough.number).padStart(2, '0')}
            </Sticker>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] sm:text-5xl">
              <span className="display-offset">{borough.name}</span>
            </h2>
            <p className="mt-2 font-editorial text-lg italic text-terracotta">
              {borough.subtitle}
            </p>
          </div>
        </div>

        {/* Overarching theme + what it represents */}
        {borough.overarchingTheme && (
          <p className="mt-6 max-w-prose text-base font-medium text-ink/90">
            <span className="font-display text-xs uppercase tracking-wider text-terracotta">
              The theme ·{' '}
            </span>
            {borough.overarchingTheme}
          </p>
        )}
        {borough.whatItRepresents && (
          <p className="mt-3 max-w-prose text-base leading-relaxed text-ink/80">
            {borough.whatItRepresents}
          </p>
        )}

        {/* Residents */}
        {borough.residents.length > 0 && (
          <div className="mt-7">
            <p className="font-display text-xs uppercase tracking-wider text-terracotta">
              Who lives here
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {borough.residents.map((slug) => (
                <li key={slug}>
                  <CharacterChip slug={slug} size="md" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vibe Before / After Capital */}
        {(borough.vibeBefore || borough.vibeAfter) && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {borough.vibeBefore && (
              <div className="rounded-2xl border-3 border-ink bg-paper p-5 shadow-cartoon-sm">
                <p className="font-display text-[11px] uppercase tracking-wider text-teal">
                  Before Capital
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/85">
                  {borough.vibeBefore}
                </p>
              </div>
            )}
            {borough.vibeAfter && (
              <div className="rounded-2xl border-3 border-ink bg-ink p-5 text-cream shadow-cartoon-sm">
                <p className="font-display text-[11px] uppercase tracking-wider text-mustard">
                  After Capital
                </p>
                <p className="mt-2 text-sm leading-relaxed text-cream/85">
                  {borough.vibeAfter}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
