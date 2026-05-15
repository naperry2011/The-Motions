import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';

function readSlugSet(dir: string): Set<string> {
  try {
    return new Set(
      fs
        .readdirSync(path.join(process.cwd(), 'public/assets', dir))
        .map((f) => f.replace(/\.webp$/, ''))
    );
  } catch {
    return new Set();
  }
}

const availablePortraits = readSlugSet('characters');
const availableTitles = readSlugSet('titles');
const availableScenes = readSlugSet('scenes');
const availableHeroCards = readSlugSet('hero-cards');

export const hasPortrait = (slug: string) => availablePortraits.has(slug);
export const hasTitle = (slug: string) => availableTitles.has(slug);
export const hasScene = (slug: string) => availableScenes.has(slug);
export const hasHeroCard = (slug: string) => availableHeroCards.has(slug);

export function CharacterPortrait({
  slug,
  name,
  size = 240,
  className,
  priority
}: {
  slug: string;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  if (!hasPortrait(slug)) {
    // Fall back to hero card if available, then to an initial circle.
    if (hasHeroCard(slug)) {
      return (
        <Image
          src={`/assets/hero-cards/${slug}.webp`}
          width={size}
          height={size}
          alt={`${name} hero card`}
          priority={priority}
          className={className}
        />
      );
    }
    return (
      <div
        className={`flex aspect-square items-center justify-center rounded-full bg-teal-500 font-display text-cream ${className ?? ''}`}
        style={{ width: size, height: size, fontSize: size * 0.32 }}
      >
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <Image
      src={`/assets/characters/${slug}.webp`}
      width={size}
      height={size}
      alt={`${name} character art`}
      priority={priority}
      className={className}
    />
  );
}

export function CharacterHeroCard({
  slug,
  name,
  className,
  priority
}: {
  slug: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  if (!hasHeroCard(slug)) return null;
  return (
    <Image
      src={`/assets/hero-cards/${slug}.webp`}
      width={1200}
      height={1000}
      alt={`${name} — character hero card`}
      priority={priority}
      className={className}
    />
  );
}

export function CharacterTitle({
  slug,
  name,
  className
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  if (!hasTitle(slug)) return null;
  return (
    <Image
      src={`/assets/titles/${slug}.webp`}
      width={750}
      height={500}
      alt={`${name} title card`}
      className={className}
    />
  );
}

export function CharacterScene({
  slug,
  name,
  className
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  if (!hasScene(slug)) return null;
  return (
    <Image
      src={`/assets/scenes/${slug}.webp`}
      width={1200}
      height={628}
      alt={`${name}'s district in Mo Town`}
      className={className}
    />
  );
}
