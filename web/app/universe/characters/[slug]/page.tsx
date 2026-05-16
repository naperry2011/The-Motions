import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allCharacters, getCharacter, getPair } from '@/lib/content';
import type { CharacterTraits } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import {
  CharacterPortrait,
  CharacterHeroCard,
  CharacterScene,
  hasHeroCard,
  hasPortrait,
  hasScene
} from '@/components/decor/CharacterPortrait';
import { Sticker } from '@/components/decor/Sticker';
import { Squiggle, Zigzag } from '@/components/decor/Squiggle';

export function generateStaticParams() {
  return allCharacters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCharacter(slug);
  return { title: c?.name ?? 'Character' };
}

type StickerTint = 'mustard' | 'terracotta' | 'teal' | 'cream';
function stateColor(state?: string): StickerTint {
  const s = (state ?? '').toLowerCase();
  if (s.includes('shadow')) return 'terracotta';
  if (s.includes('grounded')) return 'teal';
  if (s.includes('neutral')) return 'mustard';
  if (s.includes('apex') || s.includes('mastermind') || s.includes('bad'))
    return 'terracotta';
  return 'mustard';
}

function stateLabel(state?: string): string {
  const s = (state ?? '').toLowerCase();
  if (s.includes('shadow')) return 'Shadow State';
  if (s.includes('grounded')) return 'Grounded State';
  return state ?? 'A motion';
}

export default async function CharacterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacter(slug);
  if (!character) notFound();

  const traits: CharacterTraits = character.traits ?? {};
  const pair = getPair(slug);
  const tint = stateColor(traits.state);
  const label = stateLabel(traits.state);

  // Bio fallback chain: TBM-written `bio` → existing `personality` → nothing.
  const bio = traits.bio ?? traits.personality;

  return (
    <div>
      {/* ── 1. CHARACTER CARD ── */}
      <section className="bg-paper px-5 pt-28 pb-12 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/universe/characters"
            className="inline-block text-[11px] font-display uppercase tracking-wider text-ink/60 hover:text-terracotta"
          >
            ← All characters
          </Link>

          <RevealOnView delay={0.1} className="mt-6 sm:mt-8">
            {hasHeroCard(slug) ? (
              <div className="relative overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg">
                <CharacterHeroCard
                  slug={slug}
                  name={character.name}
                  priority
                  className="h-auto w-full"
                />
                <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                  <Sticker color={tint} rotate={-3}>
                    {label}
                  </Sticker>
                </div>
              </div>
            ) : hasPortrait(slug) ? (
              <div className="relative mx-auto aspect-square max-w-xl">
                <div className="absolute inset-0 rounded-full border-3 border-ink bg-mustard shadow-cartoon-lg" />
                <CharacterPortrait
                  slug={slug}
                  name={character.name}
                  size={520}
                  priority
                  className="relative h-full w-full object-contain p-6"
                />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Sticker color={tint} rotate={-3}>
                    {label}
                  </Sticker>
                </div>
                <p className="mt-6 text-center font-display text-5xl text-ink sm:text-6xl">
                  {character.name}
                </p>
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-3xl border-3 border-ink bg-mustard shadow-cartoon-lg">
                <span className="font-display text-7xl text-ink sm:text-9xl">
                  {character.name}
                </span>
              </div>
            )}
          </RevealOnView>
        </div>
      </section>

      {/* ── 2. WHAT [NAME] REPRESENTS ── */}
      {traits.represents && (
        <section className="bg-paper px-5 pb-10 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <RevealOnView>
              <p className="font-display text-[11px] uppercase tracking-[0.25em] text-terracotta">
                What {character.name} represents
              </p>
              <p className="mt-4 max-w-prose font-editorial text-3xl italic leading-snug text-ink sm:text-4xl md:text-5xl">
                {traits.represents}.
              </p>
            </RevealOnView>
          </div>
        </section>
      )}

      {/* ── 3. BIO ── */}
      {bio && (
        <section className="bg-paper px-5 pb-10 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <RevealOnView>
              <div className="rounded-3xl border-3 border-ink bg-cream px-6 py-7 shadow-cartoon sm:px-9 sm:py-9">
                <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                  Bio
                </p>
                <p className="mt-4 text-base leading-relaxed text-ink/85 sm:text-lg">
                  {bio}
                </p>
              </div>
            </RevealOnView>
          </div>
        </section>
      )}

      {/* ── 4. HOW THIS MOTION SHOWS UP FOR YOU ── */}
      {traits.howItShowsUp && (
        <section className="bg-paper px-5 pb-12 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <RevealOnView>
              <div className="rounded-3xl border-3 border-ink bg-mustard px-6 py-8 shadow-cartoon-lg sm:px-10 sm:py-10">
                <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                  How this motion shows up for you
                </p>
                <p className="mt-4 font-display text-2xl leading-snug text-ink sm:text-3xl">
                  {traits.howItShowsUp}
                </p>
              </div>
            </RevealOnView>
          </div>
        </section>
      )}

      {/* ── 5. PAIRED WITH ── */}
      {pair && (
        <section className="bg-paper px-5 pb-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <RevealOnView>
              <Link
                href={`/universe/characters/${pair.slug}`}
                className="group flex items-center justify-between gap-4 rounded-3xl border-3 border-ink bg-cream p-5 shadow-cartoon transition-transform hover:-translate-y-1 sm:p-7"
              >
                <div>
                  <p className="font-display text-[11px] uppercase tracking-[0.25em] text-terracotta">
                    Paired with
                  </p>
                  <p className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                    {pair.name}
                  </p>
                </div>
                <span className="font-display text-3xl text-terracotta transition-transform group-hover:translate-x-1 sm:text-4xl">
                  ↔
                </span>
              </Link>
            </RevealOnView>
          </div>
        </section>
      )}

      {/* ── 6. WHERE [NAME] LIVES ── */}
      {hasScene(slug) && (
        <section className="relative bg-teal-grain">
          <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <p className="mb-6 text-center font-display text-[11px] uppercase tracking-[0.25em] text-mustard">
              Where {character.name} lives
            </p>
            <CharacterScene
              slug={slug}
              name={character.name}
              className="w-full rounded-3xl border-3 border-ink shadow-cartoon-lg"
            />
          </div>
          <Zigzag className="h-5 w-full rotate-180 sm:h-6" color="#f7c948" />
        </section>
      )}

      {/* ── QUIZ NUDGE ── */}
      <section className="bg-paper px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border-3 border-ink bg-cream p-6 text-center shadow-cartoon sm:p-9">
          <p className="font-editorial text-2xl italic leading-snug text-ink sm:text-3xl">
            Not sure which motion you&apos;re in?
          </p>
          <div className="mt-5">
            <Link
              href="/quiz"
              className="inline-block rounded-full border-3 border-ink bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon-sm transition-transform hover:-translate-y-1"
            >
              Take the quiz →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
