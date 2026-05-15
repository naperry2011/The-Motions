import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';

// Read once at module load to know which characters have portrait art
const portraitDir = path.join(process.cwd(), 'public/assets/characters');
let availablePortraits: Set<string>;
try {
  availablePortraits = new Set(
    fs.readdirSync(portraitDir).map((f) => f.replace(/\.png$/, ''))
  );
} catch {
  availablePortraits = new Set();
}

const titleDir = path.join(process.cwd(), 'public/assets/titles');
let availableTitles: Set<string>;
try {
  availableTitles = new Set(fs.readdirSync(titleDir).map((f) => f.replace(/\.png$/, '')));
} catch {
  availableTitles = new Set();
}

const sceneDir = path.join(process.cwd(), 'public/assets/scenes');
let availableScenes: Set<string>;
try {
  availableScenes = new Set(fs.readdirSync(sceneDir).map((f) => f.replace(/\.png$/, '')));
} catch {
  availableScenes = new Set();
}

export function hasPortrait(slug: string) {
  return availablePortraits.has(slug);
}
export function hasTitle(slug: string) {
  return availableTitles.has(slug);
}
export function hasScene(slug: string) {
  return availableScenes.has(slug);
}

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
      src={`/assets/characters/${slug}.png`}
      width={size}
      height={size}
      alt={`${name} character art`}
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
      src={`/assets/titles/${slug}.png`}
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
      src={`/assets/scenes/${slug}.png`}
      width={1200}
      height={628}
      alt={`${name}'s district in Mo Town`}
      className={className}
    />
  );
}
