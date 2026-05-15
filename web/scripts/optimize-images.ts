/**
 * One-shot image optimizer. Converts large PNGs in public/assets/{quote-posts,
 * illustrations,scenes,titles,characters,hero} to web-friendly WebP at a max
 * width per category. Originals are replaced in place.
 *
 * Run once after dropping new source PNGs, then commit the optimized output.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

type Spec = { dir: string; width: number; quality: number };
const specs: Spec[] = [
  { dir: 'quote-posts', width: 1000, quality: 78 },
  { dir: 'illustrations', width: 1600, quality: 80 },
  { dir: 'scenes', width: 1600, quality: 82 },
  { dir: 'titles', width: 1000, quality: 85 },
  { dir: 'characters', width: 800, quality: 85 },
  { dir: 'hero', width: 1600, quality: 80 }
];

const ROOT = path.resolve(process.cwd(), 'public/assets');

async function optimize(dir: string, width: number, quality: number) {
  const abs = path.join(ROOT, dir);
  let files: string[] = [];
  try {
    files = (await fs.readdir(abs)).filter((f) => /\.png$/i.test(f));
  } catch {
    console.log(`  ${dir}: not found, skip`);
    return;
  }
  let beforeTotal = 0;
  let afterTotal = 0;
  for (const f of files) {
    const src = path.join(abs, f);
    const stat = await fs.stat(src);
    beforeTotal += stat.size;
    const tmp = path.join(abs, `${f}.tmp.webp`);
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(tmp);
    const out = path.join(abs, f.replace(/\.png$/i, '.webp'));
    await fs.rename(tmp, out);
    if (out !== src) await fs.unlink(src);
    const afterStat = await fs.stat(out);
    afterTotal += afterStat.size;
  }
  const mb = (n: number) => (n / 1024 / 1024).toFixed(1);
  console.log(`  ${dir}: ${files.length} files, ${mb(beforeTotal)} MB → ${mb(afterTotal)} MB`);
}

async function main() {
  for (const s of specs) {
    await optimize(s.dir, s.width, s.quality);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
