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
// Parses Character Documentation/COMPLETE MO TOWN CHARACTER DATABASE.docx.
// Each character section is delimited by an ALL-CAPS name followed by a
// parenthesised state/role marker:
//   "QUAKE (Shadow State: Anxiety & Fear)"
//   "BOSSY BOOTS (Neutral - Head of Security)"
//   "CAPITAL (The Apex Predator)"
// Within a section, lines like "Field: value" become structured traits.
// Lines under a "Field:" line that has no inline value collect as bullets.

type CharacterTraits = {
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
  state?: string; // shadow / grounded / neutral / bad / etc
  pairing?: string; // pair label (e.g. "Pair 1: Quake ↔ Harbor")
};

const NAME_ALIASES: Record<string, string> = {
  flo: 'flow' // docx writes "FLO", canon is "Flow"
};

const HEADING_RE = /^([A-Z][A-Z\s]+?)\s+\(([^)]+)\)\s*$/;

async function buildCharacters(quotes: Array<{ character: string; characterSlug: string }>) {
  console.log('Parsing characters…');
  const file = path.join(
    ROOT,
    'Character Documentation',
    'COMPLETE MO TOWN CHARACTER DATABASE.docx'
  );
  const text = await readDocxText(file);
  const lines = text.split(/\r?\n/);

  type Section = {
    rawName: string;
    canonSlug: string;
    parenthetical: string;
    pairing: string;
    bodyLines: string[];
  };

  const sections: Section[] = [];
  let current: Section | null = null;
  let lastPair = '';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (current) current.bodyLines.push('');
      continue;
    }

    const pairMatch = line.match(/^PAIR\s+\d+:\s*(.+)$/i);
    if (pairMatch) {
      lastPair = line;
      continue;
    }

    const headMatch = line.match(HEADING_RE);
    if (headMatch) {
      const name = headMatch[1].trim();
      const paren = headMatch[2].trim();
      let canon = slug(name);
      canon = NAME_ALIASES[canon] ?? canon;
      // Only treat as a character section if the slug looks plausible.
      // Reject "THE REAL WORLD", "THE MOTIONS", etc. which can match the head regex.
      if (current) sections.push(current);
      current = {
        rawName: name,
        canonSlug: canon,
        parenthetical: paren,
        pairing: lastPair,
        bodyLines: []
      };
      continue;
    }

    if (current) current.bodyLines.push(line);
  }
  if (current) sections.push(current);

  // Parse traits from a section body
  const parseSection = (s: Section): { traits: CharacterTraits; html: string } => {
    const traits: CharacterTraits = {};
    if (s.pairing) traits.pairing = s.pairing;

    // Extract state from parenthetical
    const pm = s.parenthetical.match(/^(Shadow State|Grounded State|Neutral|Indulgence|Maximum Intensity|Performance & Vanity|Internal Indecision|The Apex Predator|The Mastermind)\s*[:\-]?\s*(.*)$/i);
    if (pm) {
      traits.state = pm[1];
      if (pm[2]) traits.represents = pm[2];
    } else {
      traits.state = s.parenthetical;
    }

    const FIELDS: Array<[string, keyof CharacterTraits]> = [
      ['Age', 'age'],
      ['Pronouns', 'pronouns'],
      ['Represents', 'represents'],
      ['Personality', 'personality'],
      ['Work/Role', 'role'],
      ['Role', 'role'],
      ['Sexuality', 'sexuality'],
      ['Appearance', 'appearance'],
      ['Backstory', 'backstory'],
      ['Dynamic/Arc', 'arc'],
      ['Dynamic / Arc', 'arc'],
      ['Alignment', 'alignment']
    ];

    const htmlParts: string[] = [];
    let i = 0;
    while (i < s.bodyLines.length) {
      const line = s.bodyLines[i];
      if (!line) {
        i++;
        continue;
      }

      let matched = false;
      for (const [label, key] of FIELDS) {
        const re = new RegExp(`^${label.replace(/[/]/g, '\\/')}\\s*:\\s*(.*)$`, 'i');
        const m = line.match(re);
        if (m) {
          const inline = m[1].trim();
          if (inline) {
            (traits as Record<string, unknown>)[key] = inline;
          }
          matched = true;
          i++;
          break;
        }
      }
      if (matched) continue;

      // Family/Relationships block: heading line + bullets until next field/heading
      const famMatch = line.match(/^(Family\/Relationships|Relationships)\s*:?\s*$/i);
      if (famMatch) {
        const family: string[] = [];
        i++;
        while (i < s.bodyLines.length) {
          const bullet = s.bodyLines[i];
          if (!bullet) {
            i++;
            continue;
          }
          // Stop if we hit a recognised field or another heading
          if (/^(Age|Pronouns|Represents|Personality|Work\/Role|Role|Sexuality|Appearance|Backstory|Dynamic|Alignment|Industry|Connection|Before|After|How|What|The Casino)[\s\/:\-]/i.test(bullet)) {
            break;
          }
          family.push(bullet);
          i++;
        }
        if (family.length) traits.family = family;
        continue;
      }

      // Treat anything else as free-form prose for the HTML body
      htmlParts.push(`<p>${escapeHtml(line)}</p>`);
      i++;
    }

    return { traits, html: htmlParts.join('') };
  };

  const bySlugSection = new Map<string, ReturnType<typeof parseSection> & { rawName: string }>();
  for (const sec of sections) {
    if (!sec.canonSlug) continue;
    const parsed = parseSection(sec);
    bySlugSection.set(sec.canonSlug, { ...parsed, rawName: sec.rawName });
  }

  // Quote characters are authoritative — every speaker must have a record.
  const bySlug = new Map<string, { name: string; slug: string }>();
  for (const q of quotes) {
    if (!bySlug.has(q.characterSlug)) {
      bySlug.set(q.characterSlug, { name: q.character, slug: q.characterSlug });
    }
  }

  const characters = Array.from(bySlug.values())
    .map(({ slug: s, name }) => {
      const parsed = bySlugSection.get(s);
      return {
        slug: s,
        name,
        // Back-compat plain bio (concatenated prose)
        bio: parsed?.html ? parsed.html.replace(/<[^>]+>/g, '').trim() : '',
        traits: parsed?.traits ?? {},
        bodyHtml: parsed?.html ?? '',
        quoteCount: quotes.filter((q) => q.characterSlug === s).length
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const matched = characters.filter((c) => c.bodyHtml || Object.keys(c.traits).length).length;
  console.log(`  matched ${matched}/${characters.length} characters to docx sections`);

  await writeJson('characters.json', characters);
  return characters;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------- Geography, Arcs, Exacerbators, Lore (narrative HTML) ----------
async function buildNarrativeDoc(srcRel: string[], outName: string, title: string) {
  console.log(`Parsing ${title}…`);
  const file = path.join(ROOT, ...srcRel);
  const html = await readDocxHtml(file);
  await writeJson(outName, { title, html });
}

// ---------- Geography (structured) ----------
// Layered on top of the legacy narrative HTML. After buildNarrativeDoc has
// written geography.json with { title, html }, this function re-reads the
// docx text, parses the 5 borough sections + intro/aesthetic + before/after
// Capital, detects character mentions per borough, and merges everything
// back into geography.json.
async function buildGeographyStructured(
  characters: Array<{ name: string; slug: string }>
) {
  console.log('Parsing geography structure…');
  const file = path.join(
    ROOT,
    'Character Documentation',
    'MO TOWN COMPLETE GEOGRAPHY & HOUSING.docx'
  );
  const text = await readDocxText(file);
  const lines = text.split(/\r?\n/);

  // ---- Resident detection ----
  // The doc has an authoritative "HOUSING BY BOROUGH:" summary section near
  // the end. Parse that for the canonical resident list per borough.
  const canonSlugByName = new Map<string, string>();
  for (const c of characters) {
    canonSlugByName.set(c.name.toLowerCase(), c.slug);
  }
  const residentsByBoroughName = new Map<string, string[]>();
  {
    let inHousingSection = false;
    let currentBorough = '';
    for (const raw of lines) {
      const l = raw.trim();
      if (/^HOUSING BY BOROUGH:?$/i.test(l)) {
        inHousingSection = true;
        continue;
      }
      if (!inHousingSection) continue;
      const boroughHead = l.match(/^(THE\s+[A-Z\s]+?):\s*$/);
      if (boroughHead) {
        currentBorough = boroughHead[1].trim();
        residentsByBoroughName.set(currentBorough, []);
        continue;
      }
      if (!currentBorough) continue;
      // Stop if we hit another all-caps non-housing header
      if (/^[A-Z\s&]{8,}:?$/.test(l) && !/^THE\s/.test(l)) {
        inHousingSection = false;
        continue;
      }
      // Entry pattern: "Name [& Name…] - description" or "Name, Name, Name - description"
      const dashIdx = l.indexOf(' - ');
      if (dashIdx < 1) continue;
      const namesPart = l.slice(0, dashIdx);
      const names = namesPart
        .split(/,|\s&\s|\sand\s/i)
        .map((n) => n.trim())
        .filter(Boolean);
      const list = residentsByBoroughName.get(currentBorough)!;
      for (const n of names) {
        let s = slug(n);
        if (s in NAME_ALIASES) s = NAME_ALIASES[s];
        const cs = canonSlugByName.has(n.toLowerCase())
          ? canonSlugByName.get(n.toLowerCase())!
          : characters.find((c) => c.slug === s)?.slug;
        if (cs && !list.includes(cs)) list.push(cs);
      }
    }
  }

  // 1. Find borough section boundaries
  type RawBorough = {
    number: number;
    name: string;
    subtitle: string;
    startLine: number;
    endLine: number;
    body: string[];
  };
  const boroughs: RawBorough[] = [];
  const headRe = /^(\d+)\.\s+(THE\s+[A-Z\s]+?)\s*\(([^)]+)\)\s*$/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headRe);
    if (m) {
      if (boroughs.length) boroughs[boroughs.length - 1].endLine = i;
      boroughs.push({
        number: Number(m[1]),
        name: m[2].trim(),
        subtitle: m[3].trim(),
        startLine: i,
        endLine: lines.length,
        body: []
      });
    }
  }

  // 2. For each borough, slice the body
  for (const b of boroughs) {
    b.body = lines.slice(b.startLine + 1, b.endLine).filter((l) => l.trim());
  }

  // 3. Page-level intro / aesthetic — first section before the boroughs
  const introLines = boroughs.length ? lines.slice(0, boroughs[0].startLine) : [];
  let intro = '';
  let aesthetic = '';
  for (let i = 0; i < introLines.length; i++) {
    const t = introLines[i].trim();
    if (/^OVERALL LAYOUT:/i.test(t)) {
      // Next non-empty line is the intro paragraph
      for (let j = i + 1; j < introLines.length; j++) {
        if (introLines[j].trim()) {
          intro = introLines[j].trim();
          break;
        }
      }
    }
    const aMatch = t.match(/^The Aesthetic:\s*(.+)$/i);
    if (aMatch) aesthetic = aMatch[1].trim();
  }

  // 4. Per-borough field extraction
  const findField = (body: string[], label: string): string => {
    for (const l of body) {
      const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, 'i');
      const m = l.match(re);
      if (m) return m[1].trim();
    }
    return '';
  };

  // The Vibe section has Before Capital + After Capital sub-blocks.
  // Returns { before, after } strings.
  const findVibe = (body: string[]): { before: string; after: string } => {
    let inVibe = false;
    let before = '';
    let after = '';
    for (const raw of body) {
      const l = raw.trim();
      if (/^The Vibe:?\s*$/i.test(l)) {
        inVibe = true;
        continue;
      }
      if (!inVibe) continue;
      const bm = l.match(/^Before Capital:\s*(.+)$/i);
      const am = l.match(/^After Capital:\s*(.+)$/i);
      if (bm) before = bm[1].trim();
      if (am) after = am[1].trim();
    }
    return { before, after };
  };

  // 5. Build structured borough records
  const boroughsOut = boroughs.map((b) => {
    const vibe = findVibe(b.body);
    return {
      slug: slug(b.name),
      number: b.number,
      name: b.name,
      subtitle: b.subtitle,
      overarchingTheme: findField(b.body, 'Overarching Theme'),
      whatItRepresents: findField(b.body, 'What It Represents'),
      residents: residentsByBoroughName.get(b.name) ?? [],
      vibeBefore: vibe.before,
      vibeAfter: vibe.after
    };
  });

  // 6. Merge into existing geography.json (preserves title + html)
  const existing = JSON.parse(
    await fs.readFile(path.join(OUT, 'geography.json'), 'utf8')
  );
  const merged = { ...existing, intro, aesthetic, boroughs: boroughsOut };
  await writeJson('geography.json', merged);
  console.log(`  parsed ${boroughsOut.length} boroughs, residents detected per borough: ${boroughsOut.map((b) => b.residents.length).join('/')}`);
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
  const characters = await buildCharacters(quotes);
  await buildNarrativeDoc(
    ['Character Documentation', 'MO TOWN COMPLETE GEOGRAPHY & HOUSING.docx'],
    'geography.json',
    'Mo Town: Geography & Housing'
  );
  await buildGeographyStructured(characters);
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
