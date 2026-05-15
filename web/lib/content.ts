import quotes from '@/content/quotes.json';
import characters from '@/content/characters.json';
import geography from '@/content/geography.json';
import arcs from '@/content/arcs.json';
import exacerbators from '@/content/exacerbators.json';
import historicDistrict from '@/content/historic-district.json';
import lore from '@/content/lore.json';
import modules from '@/content/modules.json';

export type Quote = { id: number; character: string; characterSlug: string; text: string };

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
export const geographyDoc = geography as NarrativeDoc;
export const arcsDoc = arcs as NarrativeDoc;
export const exacerbatorsDoc = exacerbators as NarrativeDoc;
export const historicDistrictDoc = historicDistrict as NarrativeDoc;
export const loreDoc = lore as NarrativeDoc;
export const allModules = modules as ModuleRecord[];

export function getCharacter(slug: string): Character | undefined {
  return allCharacters.find((c) => c.slug === slug);
}

export function getQuotesByCharacter(slug: string): Quote[] {
  return allQuotes.filter((q) => q.characterSlug === slug);
}
