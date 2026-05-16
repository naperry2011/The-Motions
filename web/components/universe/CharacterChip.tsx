import Link from 'next/link';
import { allCharacters } from '@/lib/content';
import {
  CharacterPortrait,
  hasPortrait
} from '@/components/decor/CharacterPortrait';

/**
 * Small pill linking to a character profile. Used in narrative bodies
 * ("Quake delivers in The Heart") and in resident lists.
 *
 * Size variants:
 *   sm — single line, no portrait (just name as cream chip)
 *   md — portrait disc + name (default)
 *   lg — bigger portrait, used for borough resident grids
 */
export function CharacterChip({
  slug,
  size = 'md'
}: {
  slug: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const character = allCharacters.find((c) => c.slug === slug);
  if (!character) return null;

  if (size === 'sm') {
    return (
      <Link
        href={`/universe/characters/${slug}`}
        className="inline-flex items-center rounded-full border-3 border-ink bg-cream px-3 py-0.5 font-display text-[11px] uppercase tracking-wider text-ink shadow-cartoon-sm transition-transform hover:-translate-y-0.5"
      >
        {character.name}
      </Link>
    );
  }

  const portraitPx = size === 'lg' ? 64 : 40;
  const padX = size === 'lg' ? 'pr-5 pl-1.5' : 'pr-4 pl-1';
  const textCls =
    size === 'lg' ? 'font-display text-base' : 'font-display text-xs uppercase tracking-wider';

  return (
    <Link
      href={`/universe/characters/${slug}`}
      className={`inline-flex items-center gap-3 rounded-full border-3 border-ink bg-cream py-1 ${padX} text-ink shadow-cartoon-sm transition-transform hover:-translate-y-0.5`}
    >
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink bg-mustard"
        style={{ width: portraitPx, height: portraitPx }}
      >
        {hasPortrait(slug) ? (
          <CharacterPortrait
            slug={slug}
            name={character.name}
            size={portraitPx}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-base text-ink">{character.name.charAt(0)}</span>
        )}
      </span>
      <span className={textCls}>{character.name}</span>
    </Link>
  );
}
