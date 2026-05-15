import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  allCharacters,
  getCharacter,
  getPair,
  getQuotesByCharacter
} from '@/lib/content';
import type { CharacterTraits } from '@/lib/content';
import { RevealOnView } from '@/components/motion/RevealOnView';
import {
  CharacterPortrait,
  CharacterHeroCard,
  CharacterTitle,
  CharacterScene,
  hasHeroCard,
  hasPortrait,
  hasTitle,
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

export default async function CharacterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacter(slug);
  if (!character) notFound();

  const quotes = getQuotesByCharacter(slug);
  const others = allCharacters.filter((c) => c.slug !== slug).slice(0, 6);
  const traits: CharacterTraits = character.traits ?? {};
  const pair = getPair(slug);

  const stateLabel = traits.state ?? 'A motion';
  const tint = stateColor(traits.state);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-paper px-5 pt-28 pb-12 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/universe/characters"
            className="inline-block text-[11px] font-display uppercase tracking-wider text-ink/60 hover:text-terracotta"
          >
            ← All characters
          </Link>

          <div className="mt-6 grid items-start gap-8 md:mt-10 md:grid-cols-[1fr_1fr] md:gap-12">
            {/* Left: type + title + represents */}
            <div>
              <Sticker color={tint} rotate={-3}>
                {stateLabel}
              </Sticker>

              {hasTitle(slug) ? (
                <div className="mt-5">
                  <CharacterTitle
                    slug={slug}
                    name={character.name}
                    className="h-auto w-full max-w-md"
                  />
                </div>
              ) : (
                <h1 className="mt-5 font-display text-[clamp(3rem,11vw,7rem)] leading-[0.95]">
                  <span className="display-offset">{character.name}</span>
                </h1>
              )}

              {traits.represents && (
                <p className="mt-6 max-w-prose font-editorial text-2xl italic leading-snug text-terracotta sm:text-3xl">
                  {traits.represents}.
                </p>
              )}

              {pair && (
                <div className="mt-7">
                  <Link
                    href={`/universe/characters/${pair.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border-3 border-ink bg-cream px-4 py-2 font-display text-xs uppercase tracking-wider text-ink shadow-cartoon-sm transition-transform hover:-translate-y-0.5"
                  >
                    <span className="text-terracotta">↔</span>
                    <span>Paired with</span>
                    <span className="text-terracotta">{pair.name}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Right: hero card / portrait */}
            <RevealOnView delay={0.1}>
              {hasHeroCard(slug) ? (
                <div className="overflow-hidden rounded-3xl border-3 border-ink shadow-cartoon-lg">
                  <CharacterHeroCard
                    slug={slug}
                    name={character.name}
                    priority
                    className="h-auto w-full"
                  />
                </div>
              ) : hasPortrait(slug) ? (
                <div className="relative aspect-square animate-bobble">
                  <div className="absolute inset-0 rounded-full border-3 border-ink bg-mustard shadow-cartoon-lg" />
                  <CharacterPortrait
                    slug={slug}
                    name={character.name}
                    size={520}
                    priority
                    className="relative h-full w-full object-contain p-6"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-3xl border-3 border-ink bg-mustard shadow-cartoon-lg">
                  <span className="font-display text-7xl text-ink sm:text-9xl">
                    {character.name.charAt(0)}
                  </span>
                </div>
              )}
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* ── PERSONALITY BAND (full-width manifesto feel) ── */}
      {traits.personality && (
        <section className="bg-paper px-5 pb-12 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <RevealOnView>
              <div className="rounded-3xl border-3 border-ink bg-mustard px-6 py-8 shadow-cartoon-lg sm:px-10 sm:py-10">
                <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                  Who they are
                </p>
                <p className="mt-4 font-display text-2xl leading-snug text-ink sm:text-3xl">
                  {traits.personality}
                </p>
              </div>
            </RevealOnView>
          </div>
        </section>
      )}

      {/* ── STATS + FAMILY (side by side on md+) ── */}
      {(traits.age ||
        traits.pronouns ||
        traits.role ||
        traits.sexuality ||
        traits.alignment ||
        traits.appearance ||
        traits.family) && (
        <section className="bg-paper px-5 pb-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {/* Stats */}
            {(traits.age ||
              traits.pronouns ||
              traits.role ||
              traits.sexuality ||
              traits.alignment ||
              traits.appearance) && (
              <RevealOnView>
                <div className="h-full rounded-3xl border-3 border-ink bg-cream p-6 shadow-cartoon sm:p-7">
                  <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                    The Stats
                  </p>
                  <dl className="mt-5 space-y-4 text-sm">
                    {traits.age && (
                      <Stat label="Age" value={cleanFromImage(traits.age)} />
                    )}
                    {traits.pronouns && <Stat label="Pronouns" value={traits.pronouns} />}
                    {traits.role && <Stat label="Role" value={traits.role} />}
                    {traits.sexuality && (
                      <Stat label="Sexuality" value={traits.sexuality} />
                    )}
                    {traits.alignment && (
                      <Stat label="Alignment" value={traits.alignment} />
                    )}
                    {traits.appearance && (
                      <Stat label="Appearance" value={traits.appearance} />
                    )}
                  </dl>
                </div>
              </RevealOnView>
            )}

            {/* Family */}
            {traits.family && traits.family.length > 0 && (
              <RevealOnView delay={0.08} className="md:col-span-2">
                <div className="h-full rounded-3xl border-3 border-ink bg-terracotta/15 p-6 shadow-cartoon sm:p-7">
                  <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                    Family & Ties
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {traits.family.map((f, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-2xl border-3 border-ink bg-cream px-4 py-3 text-sm leading-snug text-ink/85"
                      >
                        <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnView>
            )}
          </div>
        </section>
      )}

      {/* ── BACKSTORY + ARC ── */}
      {(traits.backstory || traits.arc) && (
        <section className="relative bg-paper px-5 pb-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            {traits.backstory && (
              <RevealOnView>
                <div className="h-full rounded-3xl border-3 border-ink bg-cream p-6 shadow-cartoon sm:p-7">
                  <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                    Backstory
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/85 sm:text-base">
                    {traits.backstory}
                  </p>
                </div>
              </RevealOnView>
            )}
            {traits.arc && (
              <RevealOnView delay={0.08}>
                <div className="h-full rounded-3xl border-3 border-ink bg-mustard p-6 shadow-cartoon sm:p-7">
                  <p className="font-display text-xs uppercase tracking-wider text-terracotta">
                    Their Arc
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/85 sm:text-base">
                    {traits.arc}
                  </p>
                </div>
              </RevealOnView>
            )}
          </div>
        </section>
      )}

      {/* Free-form prose body (rare — only when docx had loose paragraphs) */}
      {character.bodyHtml && (
        <section className="bg-paper px-5 pb-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <RevealOnView>
              <div
                className="space-y-4 text-base leading-relaxed text-ink/85 [&_p]:font-sans"
                dangerouslySetInnerHTML={{ __html: character.bodyHtml }}
              />
            </RevealOnView>
          </div>
        </section>
      )}

      {/* ── SCENE ── */}
      {hasScene(slug) && (
        <section className="relative bg-teal-grain">
          <Squiggle className="h-5 w-full sm:h-6" color="#f7c948" />
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <CharacterScene
              slug={slug}
              name={character.name}
              className="w-full rounded-3xl border-3 border-ink shadow-cartoon-lg"
            />
            <p className="mt-4 text-center font-editorial italic text-cream/80">
              Where {character.name} lives.
            </p>
          </div>
          <Zigzag className="h-5 w-full rotate-180 sm:h-6" color="#f7c948" />
        </section>
      )}

      {/* ── QUOTES ── */}
      <section className="bg-paper px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Sticker color="terracotta" rotate={-2}>
            From {character.name}
          </Sticker>
          <ul className="mt-8 space-y-4 sm:space-y-5">
            {quotes.map((q, i) => (
              <RevealOnView key={q.id}>
                <li
                  className={`rounded-3xl border-3 border-ink p-6 shadow-cartoon sm:p-8 ${
                    i % 2 === 0 ? 'bg-cream' : 'bg-mustard'
                  }`}
                >
                  <p className="font-display text-xl leading-snug text-ink sm:text-2xl md:text-3xl">
                    &ldquo;{q.text}&rdquo;
                  </p>
                </li>
              </RevealOnView>
            ))}
          </ul>
        </div>
      </section>

      {/* ── MORE ── */}
      <section className="bg-teal px-5 py-14 text-cream sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-display text-xs uppercase tracking-[0.3em] text-mustard sm:mb-8">
            More motions
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/universe/characters/${o.slug}`}
                  className="block rounded-2xl border-3 border-cream/30 bg-teal-700 p-3 text-center font-display text-xl text-cream transition-colors hover:border-mustard hover:text-mustard sm:p-4 sm:text-2xl"
                >
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-[10px] uppercase tracking-wider text-ink/60">
        {label}
      </dt>
      <dd className="mt-1 leading-snug text-ink">{value}</dd>
    </div>
  );
}

// "20 (from image)" → "20"
function cleanFromImage(s: string) {
  return s.replace(/\s*\(from image\)/i, '').trim();
}
