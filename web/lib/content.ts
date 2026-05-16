import quotes from '@/content/quotes.json';
import characters from '@/content/characters.json';
import geography from '@/content/geography.json';
import arcs from '@/content/arcs.json';
import exacerbators from '@/content/exacerbators.json';
import historicDistrict from '@/content/historic-district.json';
import lore from '@/content/lore.json';
import modules from '@/content/modules.json';

export type Quote = { id: number; character: string; characterSlug: string; text: string };

export type Borough = {
  slug: string;
  number: number;
  name: string;
  subtitle: string;
  overarchingTheme: string;
  whatItRepresents: string;
  residents: string[];
  vibeBefore: string;
  vibeAfter: string;
};

export type GeographyDoc = NarrativeDoc & {
  intro?: string;
  aesthetic?: string;
  boroughs?: Borough[];
};

export type MechanismStep = { step: string; body: string };

export type PairArc = {
  shadowSlug: string;
  groundedSlug: string;
  shadowName: string;
  groundedName: string;
  startingPoint: string;
  turningPoint: string;
  thePractice: string;
  backslideMoment: string;
  growthBullets: string[];
  groundedRole: string;
  backslideOutcome: string;
};

export type ArcsDoc = NarrativeDoc & {
  mechanism?: MechanismStep[];
  importantNote?: string;
  arcs?: PairArc[];
};

export type CorruptionInteraction = {
  victimSlug: string;
  victimName: string;
  whereTheyMeet: string;
  theTrap: string;
  theSweetPart: string;
  theCorruption: string;
  theResult: string;
};

export type ExacerbatorChain = {
  exacerbatorSlug: string;
  exacerbatorName: string;
  interactions: CorruptionInteraction[];
};

export type ExacerbatorsDoc = NarrativeDoc & {
  chains?: ExacerbatorChain[];
};

export type LoreChapter = {
  slug: string;
  title: string;
  bodyHtml: string;
};

export type LoreDoc = NarrativeDoc & {
  chapters?: LoreChapter[];
};

export type CharacterTraits = {
  age?: string;
  pronouns?: string;
  represents?: string;
  personality?: string;
  role?: string;
  sexuality?: string;
  appearance?: string;
  family?: string[];
  backstory?: string;
  arc?: string;
  alignment?: string;
  state?: string;
  pairing?: string;
};

export type Character = {
  slug: string;
  name: string;
  bio: string;
  traits: CharacterTraits;
  bodyHtml: string;
  quoteCount: number;
};
export type NarrativeDoc = { title: string; html: string };
export type ModuleRecord = {
  number: number;
  title: string;
  paths: Array<Record<string, string>>;
};

export const allQuotes = quotes as Quote[];
export const allCharacters = characters as Character[];
export const geographyDoc = geography as GeographyDoc;
export const arcsDoc = arcs as ArcsDoc;
export const exacerbatorsDoc = exacerbators as ExacerbatorsDoc;
export const historicDistrictDoc = historicDistrict as NarrativeDoc;
export const loreDoc = lore as LoreDoc;
export const allModules = modules as ModuleRecord[];

export function getCharacter(slug: string): Character | undefined {
  return allCharacters.find((c) => c.slug === slug);
}

export function getQuotesByCharacter(slug: string): Quote[] {
  return allQuotes.filter((q) => q.characterSlug === slug);
}

/**
 * If a character is part of a "PAIR X: A ↔ B" pairing, return the partner.
 * The pairing string in traits looks like "PAIR 1: QUAKE ↔ HARBOR".
 */
export function getPair(slug: string): Character | undefined {
  const me = getCharacter(slug);
  if (!me?.traits.pairing) return undefined;
  const match = me.traits.pairing.match(/PAIR\s+\d+\s*:\s*(.+?)\s+↔\s+(.+)$/i);
  if (!match) return undefined;
  const a = match[1].trim().toLowerCase();
  const b = match[2].trim().toLowerCase();
  const meName = me.name.toLowerCase();
  // Match by name OR by docx alias ("flo" vs "flow")
  const partnerToken = a === meName || a === meName.replace(/w$/, '') ? b : a;
  // Find by slug or by name (case insensitive)
  return allCharacters.find(
    (c) =>
      c.slug === partnerToken ||
      c.slug === partnerToken.replace(/\s+/g, '-') ||
      c.name.toLowerCase() === partnerToken
  );
}
