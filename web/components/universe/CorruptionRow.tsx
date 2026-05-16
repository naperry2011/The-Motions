import Link from 'next/link';
import {
  CharacterPortrait,
  CharacterHeroCard,
  hasHeroCard
} from '@/components/decor/CharacterPortrait';
import type { CorruptionInteraction } from '@/lib/content';

const FIELDS: Array<[keyof CorruptionInteraction, string]> = [
  ['whereTheyMeet', 'Where they meet'],
  ['theTrap', 'The trap'],
  ['theSweetPart', 'The sweet part'],
  ['theCorruption', 'The corruption'],
  ['theResult', 'The result']
];

export function CorruptionRow({
  exacerbatorSlug,
  exacerbatorName,
  interaction
}: {
  exacerbatorSlug: string;
  exacerbatorName: string;
  interaction: CorruptionInteraction;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border-3 border-ink bg-cream shadow-cartoon">
      {/* Header: Exacerbator → Victim with portraits */}
      <header className="grid items-center gap-3 border-b-3 border-ink bg-ink p-4 text-cream sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:p-5">
        <Avatar slug={exacerbatorSlug} name={exacerbatorName} role="Exacerbator" align="left" />
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-3 border-cream bg-terracotta font-display text-xl text-cream shadow-cartoon-sm sm:h-12 sm:w-12 sm:text-2xl"
        >
          →
        </span>
        <Avatar
          slug={interaction.victimSlug}
          name={interaction.victimName}
          role="Corrupts"
          align="right"
        />
      </header>

      {/* Body: 5 labeled fields */}
      <dl className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
        {FIELDS.map(([key, label]) => {
          const value = interaction[key];
          if (!value) return null;
          return (
            <div key={key} className="rounded-2xl border-3 border-ink bg-paper p-4 shadow-cartoon-sm sm:p-5">
              <dt className="font-display text-[11px] uppercase tracking-wider text-terracotta">
                {label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink/85">{value}</dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
}

function Avatar({
  slug,
  name,
  role,
  align
}: {
  slug: string;
  name: string;
  role: string;
  align: 'left' | 'right';
}) {
  return (
    <Link
      href={`/universe/characters/${slug}`}
      className={`group flex items-center gap-3 ${align === 'right' ? 'sm:justify-end' : ''}`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border-3 border-cream bg-mustard sm:h-14 sm:w-14">
        {hasHeroCard(slug) ? (
          <CharacterHeroCard slug={slug} name={name} className="h-full w-full object-cover" />
        ) : (
          <CharacterPortrait
            slug={slug}
            name={name}
            size={56}
            className="h-full w-full object-cover"
          />
        )}
      </span>
      <div className={align === 'right' ? 'text-right' : ''}>
        <p className="font-display text-[10px] uppercase tracking-wider text-mustard">
          {role}
        </p>
        <p className="font-display text-xl leading-none text-cream group-hover:text-mustard sm:text-2xl">
          {name}
        </p>
      </div>
    </Link>
  );
}
