import type { Page, Para, TextEl } from './types';

/**
 * Converts the absolutely-positioned design sections of a rules page into a
 * structured list of sections → columns → rule blocks (number, title, body),
 * which the RulesView renders in the new layout.
 */

export type RuleBlock = {
  num?: string;
  title?: string;
  /** auto-numbered heading (Canva decimal list without an explicit number) */
  auto?: boolean;
  body: Para[];
  col: 0 | 1;
  y: number;
};
export type RuleSection = { subtitle?: string; cols: [RuleBlock[], RuleBlock[]] };
export type RulePage = { sections: RuleSection[] };

const plain = (p: Para) => p.r.map((r) => r.s).join('');
const textOf = (e: TextEl) => e.p.map(plain).join('\n').trim();
const maxZ = (e: TextEl) => Math.max(16, ...e.p.flatMap((p) => p.r.map((r) => r.z ?? 16)));
const fontOf = (e: TextEl) => e.p.find((p) => p.r.length)?.r[0]?.f;
const colOf = (x: number): 0 | 1 => (x < 650 ? 0 : 1);
const hasText = (p: Para) => p.r.some((r) => r.s.trim());

function splitNum(s: string): { num?: string; title: string } {
  const t = s.replace(/\s+/g, ' ').trim();
  const m = t.match(/^(\d+)\.\s*(.*)$/);
  return m ? { num: m[1], title: m[2] } : { title: t };
}

/** short line set entirely in bold or in the display face → a rule title */
function isTitleLike(p: Para): boolean {
  const t = plain(p).trim();
  if (!t || t.length > 60 || p.l) return false;
  return p.r.every((r) => !r.s.trim() || r.f === 'Horizon' || (!!r.b && r.b !== 'normal'));
}

function trim(ps: Para[]): Para[] {
  let a = 0;
  let b = ps.length;
  while (a < b && !hasText(ps[a])) a++;
  while (b > a && !hasText(ps[b - 1])) b--;
  return ps.slice(a, b);
}

export function toRulePage(page: Page): RulePage {
  let lastSub: string | undefined;
  let counter = 0;

  const sections = page.s.map((sec): RuleSection => {
    const txt = sec.el.filter((e): e is TextEl => e.t === 'txt' && textOf(e) !== 'HOME');
    const pageTitle = new Set(txt.filter((e) => e.y < 60 && maxZ(e) >= 50));
    const subs = txt
      .filter((e) => !pageTitle.has(e) && fontOf(e) === 'Anton' && maxZ(e) >= 28 && e.y < 190)
      .sort((a, b) => a.y - b.y);
    const subSet = new Set(subs);
    const heads = txt.filter((e) => !subSet.has(e) && !pageTitle.has(e) && fontOf(e) === 'Anton' && maxZ(e) >= 18 && maxZ(e) < 28);
    const headSet = new Set(heads);
    const bodies = txt.filter((e) => !pageTitle.has(e) && !subSet.has(e) && !headSet.has(e));

    const subtitle = subs.length ? textOf(subs[0]) : lastSub;
    lastSub = subtitle;

    const blocks: RuleBlock[] = [];
    const used = new Set<TextEl>();

    for (const h of heads) {
      const col = colOf(h.x);
      const body = bodies
        .filter((b) => !used.has(b) && colOf(b.x) === col && b.y > h.y && b.y - h.y < 80)
        .sort((a, b) => a.y - b.y)[0];
      if (body) used.add(body);
      const { num, title } = splitNum(textOf(h));
      blocks.push({ num, title, auto: !num && h.p[0]?.l === 'decimal', body: body ? trim(body.p) : [], col, y: h.y });
    }

    for (const b of bodies) {
      if (used.has(b)) continue;
      const col = colOf(b.x);
      let cur: RuleBlock | null = null;
      const flush = () => {
        if (cur && (cur.title || cur.body.some(hasText))) blocks.push({ ...cur, body: trim(cur.body) });
      };
      b.p.forEach((p, i) => {
        if (isTitleLike(p)) {
          flush();
          cur = { ...splitNum(plain(p)), body: [], col, y: b.y + i * 0.001 };
        } else {
          if (!cur) cur = { body: [], col, y: b.y };
          cur.body.push(p);
        }
      });
      flush();
    }

    const cols: [RuleBlock[], RuleBlock[]] = [[], []];
    for (const bl of blocks) cols[bl.col].push(bl);
    cols.forEach((c) => c.sort((a, b) => a.y - b.y));
    return { subtitle, cols };
  });

  // continue numbering for auto-numbered headings (e.g. "PLAYER VOUCHING")
  for (const s of sections)
    for (const c of s.cols)
      for (const b of c) {
        if (b.num) counter = Math.max(counter, Number(b.num) || counter);
        else if (b.auto) b.num = String(++counter);
      }

  return { sections };
}

/* ---------------------------------------------------------------- icon choice */

export type IconKey =
  | 'chat' | 'wave' | 'mic' | 'users' | 'idcard' | 'ear' | 'mask' | 'logout' | 'globe' | 'scissors'
  | 'camera' | 'hand' | 'eye' | 'video' | 'zap' | 'crosshair' | 'heart' | 'skull' | 'ban' | 'refresh'
  | 'alert' | 'bluetooth' | 'gavel' | 'swords' | 'trophy' | 'shield' | 'theater' | 'gamepad' | 'bell' | 'crown' | 'flag' | 'run' | 'school';

const RULES: [RegExp, IconKey][] = [
  [/communication/, 'chat'],
  [/voice changer/, 'wave'],
  [/microphone/, 'mic'],
  [/racism|discrimination|vouch|alliance/, 'users'],
  [/name/, 'idcard'],
  [/voice recognition/, 'mic'],
  [/in character/, 'theater'],
  [/logging|disconnect/, 'logout'],
  [/cross-?rp/, 'globe'],
  [/cut rp/, 'scissors'],
  [/feather|post|photo/, 'camera'],
  [/limit/, 'hand'],
  [/metagam/, 'eye'],
  [/stream/, 'video'],
  [/powergam/, 'zap'],
  [/deathmatch|rdm/, 'crosshair'],
  [/value|life rule|nlr/, 'heart'],
  [/kill|death|return/, 'skull'],
  [/violence|forced/, 'ban'],
  [/scenario|enforcement/, 'alert'],
  [/bluetooth/, 'bluetooth'],
  [/violated|sanction|penalt/, 'gavel'],
  [/brawl|recess/, 'run'],
  [/king|streets/, 'crown'],
  [/school war|\bwar\b/, 'school'],
  [/clash/, 'users'],
  [/raid/, 'swords'],
  [/loot|vault|pursuit/, 'trophy'],
];

export function iconFor(title?: string): IconKey {
  const t = (title ?? '').toLowerCase();
  for (const [re, key] of RULES) if (re.test(t)) return key;
  return 'shield';
}
