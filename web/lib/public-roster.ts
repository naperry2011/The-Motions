/**
 * The 18 base Motions (9 Shadow × 9 Grounded pairs) that are part of the
 * public launch. The 7 "Bad / Neutral" characters — Capital (Apex Predator),
 * plus the six Exacerbators (Amp, Bossy Boots, Glitch, Honeytrap, Mirrorball,
 * Velour) — exist as canonical characters in the content pipeline and still
 * have profile pages at their URLs, but are filtered out of public listings
 * (cast grid, homepage carousel) until the graphic novel introduces them.
 *
 * Source: TheMotions_SiteAudit.pdf (16 May 2026).
 */
export const PUBLIC_CHARACTER_SLUGS = [
  // Pair 1
  'quake',
  'harbor',
  // Pair 2
  'static',
  'north',
  // Pair 3
  'polish',
  'pilot',
  // Pair 4
  'pinch',
  'plenty',
  // Pair 5
  'shade',
  'signal',
  // Pair 6
  'guess',
  'ledger',
  // Pair 7
  'drift',
  'frame',
  // Pair 8
  'echo',
  'resonate',
  // Pair 9
  'sputter',
  'flo'
] as const;

const PUBLIC_SET = new Set<string>(PUBLIC_CHARACTER_SLUGS);

export function isPublicCharacter(slug: string): boolean {
  return PUBLIC_SET.has(slug);
}
