/**
 * Content pipeline. Parses source docs from the repo root into typed JSON
 * under web/content/. Run via `npm run content:build` from web/.
 *
 * Source documents live one level up from web/, in the repo root.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

const ROOT = path.resolve(process.cwd(), '..');
const OUT = path.resolve(process.cwd(), 'content');

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function readDocxText(file: string): Promise<string> {
  const res = await mammoth.extractRawText({ path: file });
  return res.value;
}

async function readDocxHtml(file: string): Promise<string> {
  const res = await mammoth.convertToHtml({ path: file });
  return res.value;
}

async function writeJson(name: string, data: unknown) {
  await fs.mkdir(OUT, { recursive: true });
  const file = path.join(OUT, name);
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  → wrote ${name}`);
}

// ---------- Quotes ----------
async function buildQuotes() {
  console.log('Parsing quotes…');
  const csvPath = path.join(
    ROOT,
    'The Motions Workbook Compotents',
    'motions_complete_250_quotes.csv'
  );
  const raw = await fs.readFile(csvPath, 'utf8');
  const rows = parseCsv(raw, { columns: true, skip_empty_lines: true }) as Array<{
    Character: string;
    Quote: string;
  }>;
  const quotes = rows.map((r, i) => ({
    id: i + 1,
    character: r.Character.trim(),
    characterSlug: slug(r.Character),
    text: r.Quote.trim()
  }));
  await writeJson('quotes.json', quotes);
  return quotes;
}

// ---------- Characters ----------
// Heuristic: split the character database doc into blocks by ALL-CAPS-or-titled
// headings. Each block becomes a record with a name + raw body. Downstream
// pages render the body as prose. This is intentionally forgiving — exact
// field extraction can be tightened once we see the real structure.
async function buildCharacters(quotes: Array<{ character: string; characterSlug: string }>) {
  console.log('Parsing characters…');
  const file = path.join(
    ROOT,
    'Character Documentation',
    'COMPLETE MO TOWN CHARACTER DATABASE.docx'
  );
  const text = await readDocxText(file);
  const lines = text.split(/\r?\n/);

  type Block = { name: string; body: string[] };
  const blocks: Block[] = [];
  let current: Block | null = null;

  const isHeading = (line: string) => {
    const t = line.trim();
    if (!t) return false;
    if (t.length > 60) return false;
    // Heading heuristic: starts with capital, no sentence punctuation at end.
    if (!/^[A-Z]/.test(t)) return false;
    if (/[.!?,;:]$/.test(t)) return false;
    // Must contain a letter run that's mostly capitalized OR title-case word.
    return /^[A-Z][A-Za-z'\- ]{1,40}$/.test(t);
  };

  for (const line of lines) {
    if (isHeading(line)) {
      if (current && current.body.length) blocks.push(current);
      current = { name: line.trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current && current.body.length) blocks.push(current);

  // Quote characters are authoritative — they're the canon speakers.
  // The docx parser is best-effort: we look up bio by exact-name slug match.
  const docxBySlug = new Map<string, Block>();
  for (const b of blocks) docxBySlug.set(slug(b.name), b);

  const bySlug = new Map<string, { name: string; slug: string }>();
  for (const q of quotes) {
    if (!bySlug.has(q.characterSlug)) {
      bySlug.set(q.characterSlug, { name: q.character, slug: q.characterSlug });
    }
  }

  const characters = Array.from(bySlug.values())
    .map(({ slug: s, name }) => {
      const block = docxBySlug.get(s);
      const bio = block ? block.body.join('\n').trim() : '';
      return {
        slug: s,
        name,
        bio,
        quoteCount: quotes.filter((q) => q.characterSlug === s).length
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  await writeJson('characters.json', characters);
  return characters;
}

// ---------- Geography, Arcs, Exacerbators, Lore (narrative HTML) ----------
async function buildNarrativeDoc(srcRel: string[], outName: string, title: string) {
  console.log(`Parsing ${title}…`);
  const file = path.join(ROOT, ...srcRel);
  const html = await readDocxHtml(file);
  await writeJson(outName, { title, html });
}

// ---------- Modules ----------
async function buildModules() {
  console.log('Parsing workbook modules…');
  const dir = path.join(ROOT, 'The Motions Workbook Compotents');
  const files = (await fs.readdir(dir)).filter(
    (f) => /^Module\d_.+\.xlsx$/.test(f) && !f.startsWith('~$')
  );

  const modules = [] as Array<{
    number: number;
    title: string;
    paths: Array<Record<string, string>>;
  }>;

  for (const f of files.sort()) {
    const m = f.match(/^Module(\d)_([^.]+)\.xlsx$/);
    if (!m) continue;
    const number = Number(m[1]);
    const title = m[2].replace(/_/g, ' ');
    const wb = XLSX.readFile(path.join(dir, f));
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
    modules.push({ number, title, paths: rows });
  }
  modules.sort((a, b) => a.number - b.number);
  await writeJson('modules.json', modules);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const quotes = await buildQuotes();
  await buildCharacters(quotes);
  await buildNarrativeDoc(
    ['Character Documentation', 'MO TOWN COMPLETE GEOGRAPHY & HOUSING.docx'],
    'geography.json',
    'Mo Town: Geography & Housing'
  );
  await buildNarrativeDoc(
    ['Character Documentation', 'CHARACTER ARCS & TRANSFORMATIONS.docx'],
    'arcs.json',
    'Character Arcs & Transformations'
  );
  await buildNarrativeDoc(
    ['Character Documentation', 'SPECIFIC EXACERBATOR → MOTION CORRUPTION INTERACTIONS.docx'],
    'exacerbators.json',
    'Exacerbator → Motion Corruption Interactions'
  );
  await buildNarrativeDoc(
    ['Character Documentation', 'THE HISTORIC DISTRICT - THE COMMUNITY CENTER.docx'],
    'historic-district.json',
    'The Historic District — The Community Center'
  );
  await buildNarrativeDoc(
    ['THE MOTIONS UNIVERSE LORE - CLIENT WORK CONNECTION.docx'],
    'lore.json',
    'The Motions Universe Lore — Client Work Connection'
  );
  await buildModules();
  console.log('\nContent build complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
