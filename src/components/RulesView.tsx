'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { iconFor, toRulePage, type RuleBlock } from '@/lib/rules';
import { TITLES } from '@/lib/routes';
import type { Page, Para, Run } from '@/lib/types';
import { InfoIcon } from './icons';
import { RuleIcon } from './ruleIcons';
import type { IconKey } from '@/lib/rules';
import css from './RulesView.module.css';

const mark = { '--ys-rules': 1 } as CSSProperties;

/** Banners cut from the page designs; pages without one get the live title treatment. */
const BAKED_BANNER: Record<string, string> = {
  'general-rules': '/m/banner-general.jpg',
  'server-rules': '/m/banner-server.jpg',
};

/** Visual variant per page (each follows its own design mockup). */
const VARIANT: Record<string, 'general' | 'server'> = {
  'server-rules': 'server',
  'event-rules': 'server',
};

/** Art behind the live title for pages without their own banner. */
const LIVE_ART: Record<string, string> = {
  'event-rules': '/m/banner-server.jpg',
};

/** Icon in the section ribbon (server-style pages). */
const RIBBON_ICON: Record<string, IconKey> = {
  'server-rules': 'gamepad',
  'event-rules': 'trophy',
};

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/* ---------------------------------------------------------------- rich text */

function RunView({ r }: { r: Run }) {
  const style: CSSProperties = {
    fontWeight: r.b && r.b !== 'normal' ? 700 : undefined,
    fontStyle: r.i ? 'italic' : undefined,
    textTransform: r.f === 'Horizon' ? 'uppercase' : undefined,
    textDecoration: r.u && !r.h ? 'underline' : undefined,
  };
  if (r.h) {
    const internal = r.h.startsWith('/');
    return (
      <a className={css.link} href={r.h} style={style} {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
        {r.s}
      </a>
    );
  }
  return <span style={style}>{r.s}</span>;
}

const hasText = (p: Para) => p.r.some((r) => r.s.trim());

export function RichText({ paras }: { paras: Para[] }) {
  const out: ReactNode[] = [];
  let gap = false;
  for (let i = 0; i < paras.length; ) {
    const p = paras[i];
    if (!hasText(p)) {
      gap = true;
      i++;
      continue;
    }
    const cls = gap && out.length ? css.gap : undefined;
    gap = false;
    if (p.l) {
      const items: Para[] = [];
      while (i < paras.length && paras[i].l === p.l && hasText(paras[i])) items.push(paras[i++]);
      out.push(
        <ul key={i} className={`${css.list} ${cls ?? ''}`} style={{ listStyleType: p.l }}>
          {items.map((it, j) => (
            <li key={j}>
              {it.r.map((r, k) => (
                <RunView key={k} r={r} />
              ))}
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    out.push(
      <p key={i} className={cls}>
        {p.r.map((r, k) => (
          <RunView key={k} r={r} />
        ))}
      </p>,
    );
    i++;
  }
  return <div className={css.text}>{out}</div>;
}

/* ---------------------------------------------------------------- blocks */

function Rule({ b, row, order, pad }: { b: RuleBlock; row: number; order: number; pad?: boolean }) {
  return (
    <article
      className={`${css.rule} ${b.title ? '' : css.cont}`}
      data-row={row}
      data-lead={order === 0 || undefined}
      style={{ '--ys-order': order } as CSSProperties}
    >
      {b.title ? (
        <div className={css.iconBox}>
          <RuleIcon name={iconFor(b.title)} />
        </div>
      ) : (
        <span aria-hidden />
      )}
      <div className={css.ruleMain}>
        {b.title && (
          <h3 className={css.ruleHead}>
            {b.num && <span className={css.num}>{pad ? b.num.padStart(2, '0') : `${b.num}.`}</span>}
            <span className={css.ruleTitle}>{b.title}</span>
          </h3>
        )}
        {b.body.length > 0 && <RichText paras={b.body} />}
      </div>
    </article>
  );
}

function Banner({ slug }: { slug: string }) {
  const title = TITLES[slug] ?? '';
  const baked = BAKED_BANNER[slug];
  return (
    <header className={css.banner}>
      <img
        className={css.bannerArt}
        src={baked ?? LIVE_ART[slug] ?? '/m/banner-general.jpg'}
        alt=""
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      {baked ? (
        <h1 className={css.srOnly}>{title}</h1>
      ) : (
        <>
          <span className={css.bannerMask} aria-hidden />
          <p className={css.eyebrow}>{LIVE_ART[slug] ? 'Yankee School RP' : 'Yankee School Roleplay'}</p>
          <h1 className={css.liveTitle}>{title}</h1>
        </>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------- page */

export default function RulesView({ slug, page }: { slug: string; page: Page }) {
  const data = useMemo(() => toRulePage(page), [page]);
  const total = data.sections.length;
  const [idx, setIdx] = useState(0);
  const frameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const m = window.location.hash.match(/^#page-(\d+)$/);
    if (m) setIdx(Math.min(Math.max(Number(m[1]) - 1, 0), total - 1));
  }, [total]);

  const go = (i: number) => {
    if (i < 0 || i >= total) return;
    setIdx(i);
    window.history.replaceState(null, '', i ? `#page-${i + 1}` : window.location.pathname);
    const top = frameRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) frameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const variant = VARIANT[slug] ?? 'general';
  const pad = variant === 'server';
  const ribbonIcon: IconKey | null = pad ? RIBBON_ICON[slug] ?? 'shield' : null;

  // card-style pages: sections whose rules have no numbers get 01, 02… (left column first)
  const sections = useMemo(() => {
    if (!pad) return data.sections;
    return data.sections.map((s) => {
      if (s.cols.some((c) => c.some((b) => b.num))) return s;
      let n = 0;
      const cols = s.cols.map((c) => c.map((b) => (b.title ? { ...b, num: String(++n) } : b))) as typeof s.cols;
      return { ...s, cols };
    });
  }, [data, pad]);
  const sec = sections[idx];
  const nn = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={css.page} style={mark} data-variant={variant}>
      <Banner slug={slug} />

      <div className={css.frameWrap}>
        <section ref={frameRef} className={css.frame} aria-labelledby="ys-sec-title" key={idx}>
          <header className={css.secHead}>
            <div className={css.ribbon}>
              {ribbonIcon ? (
                <RuleIcon name={ribbonIcon} width={40} height={40} strokeWidth={1.9} className={css.ribbonIcon} />
              ) : (
                <InfoIcon width={30} height={30} className={css.ribbonIcon} />
              )}
              <h2 id="ys-sec-title">{sec.subtitle ?? TITLES[slug]}</h2>
            </div>
            {total > 1 && (
              <div className={css.count} aria-label={`Page ${idx + 1} of ${total}`}>
                <span className={css.slashes} aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={css.countPlate}>
                  <span>
                    {nn(idx + 1)} / {nn(total)}
                  </span>
                </span>
              </div>
            )}
          </header>

          {(() => {
            const [left, right] = sec.cols;
            const single = !left.length || !right.length;
            if (single) {
              return (
                <div className={css.cols} data-single>
                  {(left.length ? left : right).map((b, r) => (
                    <Rule key={r} b={b} row={r} order={r} pad={pad} />
                  ))}
                </div>
              );
            }
            // rows line up across both columns, like the design
            const rows = Math.max(left.length, right.length);
            return (
              <div className={css.cols}>
                {Array.from({ length: rows }).flatMap((_, r) =>
                  [left, right].map((col, c) =>
                    col[r] ? (
                      <Rule key={`${r}-${c}`} b={col[r]} row={r} order={c * 100 + r} pad={pad} />
                    ) : (
                      <span key={`${r}-${c}`} aria-hidden />
                    ),
                  ),
                )}
              </div>
            );
          })()}
        </section>

        {total > 1 && (
          <nav className={css.pager} aria-label="Rule pages">
            <button type="button" className={css.prev} onClick={() => go(idx - 1)} disabled={idx === 0}>
              <Chevron dir="left" /> Previous
            </button>
            <div className={css.nums}>
              {data.sections.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={css.numBtn}
                  aria-current={i === idx ? 'page' : undefined}
                  aria-label={`Page ${i + 1}`}
                  onClick={() => go(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button type="button" className={css.next} onClick={() => go(idx + 1)} disabled={idx === total - 1}>
              Next <Chevron dir="right" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
