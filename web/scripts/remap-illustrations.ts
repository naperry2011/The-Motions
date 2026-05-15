/**
 * One-shot mover for Graphics(1) → slug-named destinations.
 * See ../docs/asset-map.md for the full audit.
 *
 * Re-runnable: only renames files that still exist by their numeric name.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public/assets');
const SRC = path.join(ROOT, 'illustrations');

const scenes: Record<number, string> = {
  2: 'quake',
  3: 'harbor',
  4: 'static',
  5: 'north',
  6: 'polish',
  7: 'pilot',
  8: 'plenty',
  9: 'pinch',
  10: 'shade',
  11: 'signal',
  12: 'ledger',
  13: 'sputter',
  14: 'drift',
  15: 'guess',
  16: 'flow',
  17: 'frame',
  18: 'echo',
  19: 'resonate',
  20: 'glitch',
  21: 'honeytrap',
  22: 'mirrorball',
  23: 'bossy-boots',
  24: 'capital'
};

const heroCards: Record<number, string> = {
  25: 'quake',
  26: 'harbor',
  27: 'static',
  28: 'north',
  29: 'polish',
  30: 'pilot',
  31: 'pinch',
  32: 'plenty',
  33: 'shade',
  34: 'signal',
  35: 'guess',
  36: 'ledger',
  37: 'sputter',
  38: 'flow',
  39: 'drift',
  40: 'frame',
  41: 'echo',
  42: 'resonate',
  43: 'capital',
  44: 'bossy-boots',
  45: 'honeytrap',
  46: 'velour',
  47: 'amp',
  48: 'glitch',
  49: 'mirrorball'
};

const aliases: Record<number, string> = {
  1: 'welcome',
  50: 'cast'
};

async function moveIfExists(from: string, to: string) {
  try {
    await fs.access(from);
  } catch {
    return false;
  }
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
  return true;
}

async function main() {
  let moved = 0;

  for (const [n, slug] of Object.entries(scenes)) {
    const from = path.join(SRC, `${n}.webp`);
    const to = path.join(ROOT, 'scenes', `${slug}.webp`);
    if (await moveIfExists(from, to)) {
      console.log(`scene  ${n} → ${slug}`);
      moved++;
    }
  }

  for (const [n, slug] of Object.entries(heroCards)) {
    const from = path.join(SRC, `${n}.webp`);
    const to = path.join(ROOT, 'hero-cards', `${slug}.webp`);
    if (await moveIfExists(from, to)) {
      console.log(`hero   ${n} → ${slug}`);
      moved++;
    }
  }

  for (const [n, name] of Object.entries(aliases)) {
    const from = path.join(SRC, `${n}.webp`);
    const to = path.join(SRC, `${name}.webp`);
    if (await moveIfExists(from, to)) {
      console.log(`alias  ${n} → ${name}`);
      moved++;
    }
  }

  console.log(`\nDone. ${moved} files moved.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
