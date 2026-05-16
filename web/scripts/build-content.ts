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

// ---------- Arcs (structured) ----------
// Parses CHARACTER ARCS & TRANSFORMATIONS.docx into:
//   - mechanism: the 5-step Core Healing Mechanism (Recognition → Connection → …)
//   - importantNote: the pull-quote line about non-linearity
//   - arcs: 9 PairArc records, one per Shadow → Grounded pair
async function buildArcsStructured(
  characters: Array<{ name: string; slug: string }>
) {
  console.log('Parsing arcs structure…');
  const file = path.join(
    ROOT,
    'Character Documentation',
    'CHARACTER ARCS & TRANSFORMATIONS.docx'
  );
  const text = await readDocxText(file);
  const lines = text.split(/\r?\n/);

  // 1. Mechanism: lines like "Recognition → They first have to SEE…"
  // (the 5 step names)
  const stepNames = ['Recognition', 'Connection', 'Practice', 'Setback', 'Integration'];
  const mechanism: Array<{ step: string; body: string }> = [];
  for (const raw of lines) {
    const l = raw.trim();
    for (const step of stepNames) {
      const re = new RegExp(`^${step}\\s*→\\s*(.+)$`, 'i');
      const m = l.match(re);
      if (m && !mechanism.find((x) => x.step === step)) {
        mechanism.push({ step, body: m[1].trim() });
      }
    }
  }

  // 2. Important Note pull-quote
  let importantNote = '';
  for (const raw of lines) {
    const m = raw.match(/^Important Note:\s*(.+)$/i);
    if (m) {
      importantNote = m[1].trim();
      break;
    }
  }

  // 3. Pair section boundaries: lines like "QUAKE → HARBOR"
  const charBySlug = new Map<string, string>();
  for (const c of characters) charBySlug.set(c.slug, c.name);

  const pairHeadRe = /^([A-Z]+)\s+→\s+([A-Z]+)\s*$/;
  const pairs: Array<{
    rawShadow: string;
    rawGrounded: string;
    startLine: number;
    endLine: number;
  }> = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(pairHeadRe);
    if (m) {
      if (pairs.length) pairs[pairs.length - 1].endLine = i;
      pairs.push({
        rawShadow: m[1],
        rawGrounded: m[2],
        startLine: i,
        endLine: lines.length
      });
    }
  }

  // 4. Per-pair field extraction
  const resolveSlug = (rawName: string): string => {
    let s = slug(rawName);
    if (s in NAME_ALIASES) s = NAME_ALIASES[s];
    return s;
  };

  // Single-line "Field: value" extractor
  const findInline = (body: string[], label: string): string => {
    for (const l of body) {
      const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, 'i');
      const m = l.trim().match(re);
      if (m) return m[1].trim();
    }
    return '';
  };

  // "Growth Looks Like:" is a header followed by bullet lines until the
  // next "Foo:" field heading or end of section.
  const findGrowthBullets = (body: string[]): string[] => {
    const out: string[] = [];
    let inGrowth = false;
    for (const raw of body) {
      const l = raw.trim();
      if (!l) continue;
      if (/^Growth Looks Like:?\s*$/i.test(l)) {
        inGrowth = true;
        continue;
      }
      if (!inGrowth) continue;
      // Stop at the next labeled field
      if (
        /^([A-Z][a-zA-Z ']{0,30})('s Role)?:\s*/.test(l) &&
        !/^([A-Z][a-z]+)\s+→/.test(l)
      ) {
        // It's a new field heading
        break;
      }
      out.push(l);
    }
    return out;
  };

  const arcs = pairs.map((p) => {
    const body = lines.slice(p.startLine + 1, p.endLine);
    const shadowSlug = resolveSlug(p.rawShadow);
    const groundedSlug = resolveSlug(p.rawGrounded);
    const shadowName = charBySlug.get(shadowSlug) ?? p.rawShadow;
    const groundedName = charBySlug.get(groundedSlug) ?? p.rawGrounded;

    // Try Role field under both the canonical name and the raw docx name
    // (handles "Flo's Role" vs "Flow's Role").
    const rawGroundedTitle = p.rawGrounded.charAt(0) + p.rawGrounded.slice(1).toLowerCase();
    const groundedRole =
      findInline(body, `${groundedName}'s Role`) ||
      findInline(body, `${rawGroundedTitle}'s Role`);

    return {
      shadowSlug,
      groundedSlug,
      shadowName,
      groundedName,
      startingPoint: findInline(body, 'Starting Point'),
      turningPoint: findInline(body, 'Turning Point'),
      thePractice: findInline(body, 'The Practice'),
      backslideMoment: findInline(body, 'Backslide Moment'),
      growthBullets: findGrowthBullets(body),
      groundedRole,
      backslideOutcome: findInline(body, 'Backslide')
    };
  });

  // Merge into existing arcs.json (preserves title + html)
  const existing = JSON.parse(await fs.readFile(path.join(OUT, 'arcs.json'), 'utf8'));
  const merged = { ...existing, mechanism, importantNote, arcs };
  await writeJson('arcs.json', merged);
  console.log(
    `  parsed mechanism (${mechanism.length} steps), ${arcs.length} pair arcs`
  );
}

// ---------- Exacerbators (structured) ----------
// Parses SPECIFIC EXACERBATOR → MOTION CORRUPTION INTERACTIONS.docx into 6
// ExacerbatorChain records (one per bad/neutral character). Each chain has
// a list of CorruptionInteraction entries against their victims.
async function buildExacerbatorsStructured(
  characters: Array<{ name: string; slug: string }>
) {
  console.log('Parsing exacerbators structure…');
  const file = path.join(
    ROOT,
    'Character Documentation',
    'SPECIFIC EXACERBATOR → MOTION CORRUPTION INTERACTIONS.docx'
  );
  const text = await readDocxText(file);
  const lines = text.split(/\r?\n/);

  const charBySlug = new Map<string, string>();
  for (const c of characters) charBySlug.set(c.slug, c.name);

  const resolveSlug = (rawName: string): string => {
    let s = slug(rawName);
    if (s in NAME_ALIASES) s = NAME_ALIASES[s];
    return s;
  };

  // 1. Find chain section starts ("HONEYTRAP'S CORRUPTIONS:", etc.) and
  //    interaction starts ("Honeytrap → Quake").
  // Matches "HONEYTRAP'S CORRUPTIONS:" and "BOSSY BOOTS' CORRUPTIONS:"
  const chainRe = /^([A-Z][A-Z\s]+?)['’](?:S|s)?\s+CORRUPTIONS:?$/;
  const interactionRe = /^([A-Za-z ]+?)\s+→\s+([A-Za-z]+)\s*$/;

  type RawInteraction = { victimSlug: string; victimName: string; startLine: number; endLine: number };
  type RawChain = {
    exacerbatorRaw: string;
    exacerbatorSlug: string;
    exacerbatorName: string;
    interactions: RawInteraction[];
  };

  const chains: RawChain[] = [];
  let currentChain: RawChain | null = null;
  let currentInter: RawInteraction | null = null;

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    const chainMatch = t.match(chainRe);
    if (chainMatch) {
      // Close any open interaction
      if (currentInter) currentInter.endLine = i;
      currentInter = null;
      const rawName = chainMatch[1].trim();
      const exSlug = resolveSlug(rawName);
      currentChain = {
        exacerbatorRaw: rawName,
        exacerbatorSlug: exSlug,
        exacerbatorName: charBySlug.get(exSlug) ?? titleCase(rawName),
        interactions: []
      };
      chains.push(currentChain);
      continue;
    }

    const interMatch = t.match(interactionRe);
    if (interMatch && currentChain) {
      // Only treat as a new interaction if the LHS matches the chain's
      // exacerbator name (case-insensitive)
      const lhsSlug = resolveSlug(interMatch[1]);
      if (lhsSlug !== currentChain.exacerbatorSlug) continue;
      if (currentInter) currentInter.endLine = i;
      const vSlug = resolveSlug(interMatch[2]);
      currentInter = {
        victimSlug: vSlug,
        victimName: charBySlug.get(vSlug) ?? titleCase(interMatch[2]),
        startLine: i,
        endLine: lines.length
      };
      currentChain.interactions.push(currentInter);
    }
  }

  // 2. Extract fields from each interaction body
  const findInline = (body: string[], label: string): string => {
    for (const l of body) {
      const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, 'i');
      const m = l.trim().match(re);
      if (m) return m[1].trim();
    }
    return '';
  };

  const chainsOut = chains.map((c) => ({
    exacerbatorSlug: c.exacerbatorSlug,
    exacerbatorName: c.exacerbatorName,
    interactions: c.interactions.map((it) => {
      const body = lines.slice(it.startLine + 1, it.endLine);
      return {
        victimSlug: it.victimSlug,
        victimName: it.victimName,
        whereTheyMeet: findInline(body, 'Where They Meet'),
        theTrap: findInline(body, 'The Trap'),
        theSweetPart: findInline(body, 'The Sweet Part'),
        theCorruption: findInline(body, 'The Corruption'),
        theResult: findInline(body, 'The Result')
      };
    })
  }));

  // 3. Merge into existing exacerbators.json
  const existing = JSON.parse(
    await fs.readFile(path.join(OUT, 'exacerbators.json'), 'utf8')
  );
  const merged = { ...existing, chains: chainsOut };
  await writeJson('exacerbators.json', merged);
  console.log(
    `  parsed ${chainsOut.length} chains, interactions per chain: ${chainsOut.map((c) => c.interactions.length).join('/')}`
  );
}

function titleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
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
  await buildArcsStructured(characters);
  await buildNarrativeDoc(
    ['Character Documentation', 'SPECIFIC EXACERBATOR → MOTION CORRUPTION INTERACTIONS.docx'],
    'exacerbators.json',
    'Exacerbator → Motion Corruption Interactions'
  );
  await buildExacerbatorsStructured(characters);
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
