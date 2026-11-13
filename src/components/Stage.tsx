'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { loadSite } from '@/lib/decode';
import type { Asset, Box, El, MediaEl, Page, Para, Run, Site, TextEl } from '@/lib/types';
import { Footer, Nav } from './Chrome';
import HomeView from './Home';
import RulesView from './RulesView';
import AboutView from './AboutView';
import EventRulesView from './EventRulesView';

/** Pages rendered with the structured rules layout. */
const RULE_PAGES = new Set(['general-rules', 'server-rules', 'event-rules']);
import css from './Stage.module.css';

/** Design canvas width / height of every original section. */
const W = 1366;
const H = 768;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;

const FAMILY: Record<string, string> = {
  Anton: 'var(--ys-f-display)',
  Horizon: 'var(--ys-f-wide)',
};
const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const family = (f?: string) => `${(f && FAMILY[f]) || 'var(--ys-f-body)'},${EMOJI}`;

const WEIGHT: Record<string, number> = { thin: 100, light: 300, medium: 500, semibold: 600, bold: 700, heavy: 800, black: 900 };

/* ---------------------------------------------------------------- text */

function boxStyle(b: Box, w: number, h: number): CSSProperties {
  return { top: pct(b[0], h), left: pct(b[1], w), width: pct(b[2], w), height: pct(b[3], h) };
}

function runStyle(r: Run): CSSProperties {
  const st: CSSProperties = {
    fontFamily: family(r.f),
    fontSize: `calc(var(--ys-u) * ${r.z ?? 16})`,
    color: r.c,
    fontStyle: r.i ? 'italic' : undefined,
    fontWeight: r.b ? WEIGHT[r.b] ?? r.b : undefined,
    letterSpacing: r.ls,
    lineHeight: r.lh,
    textTransform: r.f === 'Horizon' ? 'uppercase' : undefined,
  };
  if (r.g) {
    const stops = r.g.s.map(([c, p]) => `${c} ${p * 100}%`).join(',');
    Object.assign(st, {
      backgroundImage: `linear-gradient(${r.g.a}deg,${stops})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    });
  }
  if (r.u) Object.assign(st, { textDecorationLine: 'underline', textDecorationColor: r.c });
  return st;
}

function RunView({ r }: { r: Run }) {
  const style = runStyle(r);
  if (!r.h) return <span style={style}>{r.s}</span>;
  if (r.h.startsWith('/')) {
    return (
      <Link href={r.h} className={css.link} style={style}>
        {r.s}
      </Link>
    );
  }
  return (
    <a href={r.h} className={css.link} style={style} target="_blank" rel="noopener noreferrer">
      {r.s}
    </a>
  );
}

/** Most frequent run style in a text box: sets the line box for empty lines. */
function baseRun(e: TextEl): Run {
  const tally = new Map<string, { n: number; r: Run }>();
  for (const p of e.p)
    for (const r of p.r) {
      const id = `${r.f}|${r.z}`;
      const t = tally.get(id) ?? { n: 0, r };
      t.n += r.s.length;
      tally.set(id, t);
    }
  let best: Run = { s: '' };
  let n = -1;
  for (const t of tally.values()) if (t.n > n) ((n = t.n), (best = t.r));
  return best;
}

function ParaView({ p, base }: { p: Para; base: Run }) {
  const lead = p.r[0] ?? base;
  const style: CSSProperties = {
    textAlign: (p.al as CSSProperties['textAlign']) ?? 'start',
    fontFamily: family(lead.f),
    fontSize: `calc(var(--ys-u) * ${lead.z ?? base.z ?? 16})`,
    lineHeight: lead.lh ?? '1.2em',
  };
  const heading = p.hd && /^h[1-6]$/.test(p.hd) ? { role: 'heading', 'aria-level': 3 } : {};
  return (
    <div className={css.p} style={style} {...heading}>
      {p.r.length ? p.r.map((r, i) => <RunView key={i} r={r} />) : <br />}
    </div>
  );
}

function TextView({ e }: { e: TextEl }) {
  const base = baseRun(e);
  const out: ReactNode[] = [];
  for (let i = 0; i < e.p.length; ) {
    const p = e.p[i];
    if (p.l) {
      const items: Para[] = [];
      while (i < e.p.length && e.p[i].l === p.l) items.push(e.p[i++]);
      out.push(
        <ul key={i} className={css.ul} style={{ listStyleType: p.l }}>
          {items.map((it, j) => (
            <li
              key={j}
              style={{
                color: it.r[0]?.c,
                fontSize: `calc(var(--ys-u) * ${it.r[0]?.z ?? base.z ?? 16})`,
                fontFamily: family(it.r[0]?.f ?? base.f),
                fontStyle: it.r[0]?.i ? 'italic' : undefined,
              }}
            >
              <ParaView p={it} base={base} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    out.push(<ParaView key={i} p={p} base={base} />);
    i++;
  }
  const Tag = e.tag?.startsWith('heading') ? 'h2' : 'div';
  return <Tag className={css.txt}>{out}</Tag>;
}

function MediaView({ e, asset }: { e: MediaEl; asset?: Asset }) {
  if (!asset) return null;
  return (
    <img
      src={asset.src}
      alt=""
      draggable={false}
      onContextMenu={(ev) => ev.preventDefault()}
      className={css.img}
      style={boxStyle(e.crop, e.w, e.h)}
    />
  );
}

/* ---------------------------------------------------------------- layout helpers */

const plain = (e: TextEl) =>
  e.p
    .map((p) => p.r.map((r) => r.s).join(''))
    .join('\n')
    .trim();
const firstRun = (e: TextEl): Run | undefined => e.p.find((p) => p.r.length)?.r[0];
const maxSize = (e: TextEl) => Math.max(16, ...e.p.flatMap((p) => p.r.map((r) => r.z ?? 16)));

/** Per-section "HOME" links — replaced by the site header. */
const isHomeLink = (e: El) => e.t === 'txt' && plain(e) === 'HOME' && firstRun(e)?.h === '/';
/** The big translucent panel image behind the rules — redrawn as a glass card. */
const isCard = (e: El) => e.t === 'img' && e.w >= 600 && e.h >= 300;
/** Small Anton headings (rule names / sub-titles) get an accent bar. */
const isAccent = (e: TextEl) => {
  const r = firstRun(e);
  return !!r && r.f === 'Anton' && !r.h && maxSize(e) < 40 && e.p.length === 1;
};
/** The page title at the top of the first section. */
const isTitle = (e: TextEl) => e.y < 60 && maxSize(e) >= 50;

/**
 * Canva sizes single-line text boxes (titles, rule headings, nav links) to fit
 * the text exactly; tiny font-metric differences between browsers would make
 * them wrap, so they must never wrap.
 */
function isOneLine(e: TextEl): boolean {
  const filled = e.p.filter((p) => p.r.length);
  if (filled.length !== 1 || e.p.length > 1) return false;
  return e.h <= maxSize(e) * 1.2 * 1.4;
}

/**
 * Order used when sections collapse into a single column on narrow screens:
 * big titles first, then the left column, then the right column.
 */
function flowOrder(els: El[]): number[] {
  const key = (e: El): number[] => {
    if (e.t === 'txt' && e.y < 175 && maxSize(e) >= 28) return [0, e.y, e.x];
    const col = e.x < 650 ? 0 : 1;
    return [1 + col, Math.round(e.y / 24), e.x];
  };
  const keys = els.map(key);
  const idx = els.map((_, i) => i);
  idx.sort((a, b) => {
    for (let j = 0; j < 3; j++) if (keys[a][j] !== keys[b][j]) return keys[a][j] - keys[b][j];
    return a - b;
  });
  const order = new Array<number>(els.length);
  idx.forEach((elIndex, rank) => (order[elIndex] = rank));
  return order;
}

type Prepared = { els: El[]; top: number; height: number };

/**
 * Turns Canva's fixed 1366×768 slides into content-height sections:
 * titles repeated on every slide and per-slide HOME links are dropped, and each
 * section is cropped to the area its content actually uses.
 */
function prepare(page: Page, home: boolean): Prepared[] {
  const firstTexts = page.s[0].el.flatMap((e) => (e.t === 'txt' ? [{ t: plain(e), y: e.y }] : []));
  return page.s.map((sec, i) => {
    const els = sec.el.filter((e) => {
      if (isHomeLink(e) || e.t === 'vid') return false;
      if (i > 0 && e.t === 'txt') {
        const t = plain(e);
        if (firstTexts.some((f) => f.t === t && Math.abs(f.y - e.y) < 24)) return false;
      }
      return true;
    });
    if (home || !els.length) return { els, top: 0, height: H };
    const top = Math.max(0, Math.min(...els.map((e) => e.y)) - 28);
    const bottom = Math.max(...els.map((e) => e.y + e.h)) + 36;
    return { els, top, height: bottom - top };
  });
}

/* ---------------------------------------------------------------- views */

function SectionView({
  sec,
  assets,
  index,
  total,
}: {
  sec: Prepared;
  assets: Site['assets'];
  index: number;
  total: number;
}) {
  const { els, top, height } = sec;
  const order = flowOrder(els);
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <section className={css.sec} style={{ '--ys-ar': `${W} / ${height}` } as Vars}>
      {els.map((e, i) => {
        const vars: Vars = {
          '--ys-x': pct(e.x, W),
          '--ys-y': pct(e.y - top, height),
          '--ys-w': pct(e.w, W),
          '--ys-h': pct(e.h, height),
          '--ys-o': order[i],
          transform: e.rot ? `rotate(${e.rot}deg)` : undefined,
        };
        if (e.t === 'txt') {
          const cls = [css.el, isOneLine(e) && css.one, isAccent(e) && css.accent, isTitle(e) && css.title]
            .filter(Boolean)
            .join(' ');
          return (
            <div key={i} className={cls} style={vars}>
              <TextView e={e} />
            </div>
          );
        }
        if (isCard(e)) {
          return (
            <div key={i} className={`${css.el} ${css.card}`} style={vars} aria-hidden>
              {total > 1 && <span className={css.count}>{counter}</span>}
            </div>
          );
        }
        return (
          <div key={i} className={`${css.el} ${css.media}`} style={{ ...vars, opacity: e.op }} aria-hidden>
            <MediaView e={e} asset={assets[e.id]} />
          </div>
        );
      })}
    </section>
  );
}

function Backdrop({ src, opacity, dim }: { src?: string; opacity: number; dim: boolean }) {
  return (
    <div className={css.backdrop} data-dim={dim || undefined} aria-hidden>
      {src && (
        <img src={src} alt="" draggable={false} onContextMenu={(ev) => ev.preventDefault()} style={{ '--ys-bo': opacity } as Vars} />
      )}
    </div>
  );
}

export default function Stage({ slug }: { slug: string }) {
  const [state, setState] = useState<{ page: Page; site: Site } | null>(null);

  useEffect(() => {
    const site = loadSite();
    const page = site.pages[slug];
    if (page) setState({ page, site });
  }, [slug]);

  if (!state) return <main className={css.stage} aria-busy="true" />;

  const { page, site } = state;
  const home = slug === '';
  const bg = page.s.find((s) => s.bg?.id)?.bg;
  const bgSrc = bg?.id ? site.assets[bg.id]?.src : undefined;
  const cfg = site.home;

  if (home) {
    return (
      <>
        <Nav slug={slug} cfg={cfg} />
        <main className={`${css.stage} ${css.ready}`} data-home>
          <HomeView cfg={cfg} />
        </main>
        <Footer cfg={cfg} />
      </>
    );
  }

  if (slug === 'about-ysrp' && site.about) {
    return (
      <>
        <Nav slug={slug} cfg={cfg} />
        <main>
          <AboutView about={site.about} />
        </main>
        <Footer cfg={cfg} />
      </>
    );
  }

  if (slug === 'event-rules') {
    return (
      <>
        <Nav slug={slug} cfg={cfg} />
        <main>
          <EventRulesView page={page} />
        </main>
        <Footer cfg={cfg} />
      </>
    );
  }

  if (RULE_PAGES.has(slug)) {
    return (
      <>
        <Nav slug={slug} cfg={cfg} />
        <main>
          <RulesView slug={slug} page={page} />
        </main>
        <Footer cfg={cfg} />
      </>
    );
  }

  const sections = prepare(page, home);
  return (
    <>
      <Backdrop src={bgSrc} opacity={bg?.op ?? 0.6} dim />
      <Nav slug={slug} cfg={cfg} />
      <main className={`${css.stage} ${css.ready}`}>
        {sections.map((sec, i) => (
          <SectionView key={i} sec={sec} assets={site.assets} index={i} total={sections.length} />
        ))}
      </main>
      <Footer cfg={cfg} />
    </>
  );
}
