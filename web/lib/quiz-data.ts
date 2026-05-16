import { arcsDoc, getCharacter } from '@/lib/content';

/**
 * One quiz question per pair (9 total). Each question presents the shadow and
 * grounded states of one pair as two unlabelled options — descriptions of how
 * the motion feels, sourced from each character's `represents` trait.
 *
 * The descriptors are first-draft prose drawn from existing content; TBM's
 * Phase 1 copy pass will replace these with more visceral, reader-direct
 * "which of these sounds more like you right now?" language.
 */

export type QuizOption = {
  slug: string;
  name: string;
  state: 'shadow' | 'grounded';
  descriptor: string;
};

export type QuizQuestion = {
  pairIndex: number;
  shadow: QuizOption;
  grounded: QuizOption;
};

function descriptorFor(slug: string, fallback: string): string {
  const c = getCharacter(slug);
  return c?.traits?.represents ?? fallback;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = (arcsDoc.arcs ?? []).map(
  (arc, i) => ({
    pairIndex: i + 1,
    shadow: {
      slug: arc.shadowSlug,
      name: arc.shadowName,
      state: 'shadow',
      descriptor: descriptorFor(arc.shadowSlug, arc.shadowName)
    },
    grounded: {
      slug: arc.groundedSlug,
      name: arc.groundedName,
      state: 'grounded',
      descriptor: descriptorFor(arc.groundedSlug, arc.groundedName)
    }
  })
);
