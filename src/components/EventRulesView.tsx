'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { iconFor, toRulePage, type IconKey, type RuleBlock } from '@/lib/rules';
import type { Page } from '@/lib/types';
import { RichText } from './RulesView';
import { RuleIcon } from './ruleIcons';
import css from './EventRulesView.module.css';

/** Sidebar entry for each section of the Event Rules page (matched by section title). */
const CATEGORY: { match: RegExp; icon: IconKey; sub: string }[] = [
  { match: /mechanic/i, icon: 'swords', sub: 'Event modes and win conditions' },
  { match: /raid/i, icon: 'school', sub: 'Raid conduct and enforcement' },
  { match: /sanction|penalt/i, icon: 'gavel', sub: 'Penalties and repeat offenders' },
];
const categoryFor = (title = '') => CATEGORY.find((c) => c.match.test(title)) ?? { icon: 'shield' as IconKey, sub: '' };

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

function Card({ b }: { b: RuleBlock }) {
  return (
    <article className={css.card}>
      {b.title ? (
        <div className={css.iconBox}>
          <RuleIcon name={iconFor(b.title)} />
        </div>
      ) : (
        <span aria-hidden />
      )}
      <div className={css.cardMain}>
        {b.title && (
          <h3 className={css.cardTitle}>
            <span className={css.slash} aria-hidden>
              {'//'}
            </span>
            {b.num && <span className={css.num}>{b.num}.</span>}
            {b.title}
          </h3>
        )}
        {b.body.length > 0 && <RichText paras={b.body} />}
      </div>
    </article>
  );
}

export default function EventRulesView({ page }: { page: Page }) {
  const data = useMemo(() => toRulePage(page), [page]);
  const total = data.sections.length;
  const [idx, setIdx] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const m = window.location.hash.match(/^#page-(\d+)$/);
    if (m) setIdx(Math.min(Math.max(Number(m[1]) - 1, 0), total - 1));
  }, [total]);

  const go = (i: number) => {
    if (i < 0 || i >= total) return;
    setIdx(i);
    window.history.replaceState(null, '', i ? `#page-${i + 1}` : window.location.pathname);
    const top = mainRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sec = data.sections[idx];
  const cat = categoryFor(sec.subtitle);
  const nn = (n: number) => String(n).padStart(2, '0');
  const [left, right] = sec.cols;

  return (
    <div className={css.page}>
      <header className={css.banner}>
        <img src="/m/banner-event.jpg" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
        <h1 className={css.srOnly}>Event Rules</h1>
      </header>

      <img className={css.decoRight} src="/m/event-deco-r.jpg" alt="" aria-hidden draggable={false} />

      <div className={css.layout}>
        {/* ---------------- sidebar ---------------- */}
        <aside className={css.side}>
          <nav className={css.cats} aria-label="Event categories">
            <h2 className={css.catsHead}>
              <span className={css.headSlash} aria-hidden />
              Event Categories
            </h2>
            {data.sections.map((s, i) => {
              const c = categoryFor(s.subtitle);
              return (
                <button
                  key={i}
                  type="button"
                  className={css.cat}
                  aria-current={i === idx ? 'page' : undefined}
                  onClick={() => go(i)}
                >
                  <RuleIcon name={c.icon} className={css.catIcon} />
                  <span className={css.catText}>
                    <span className={css.catTitle}>{s.subtitle}</span>
                    {c.sub && <span className={css.catSub}>{c.sub}</span>}
                  </span>
                  <Chevron dir="right" />
                </button>
              );
            })}
          </nav>
          <img className={css.sideArt} src="/m/event-side.jpg" alt="" aria-hidden draggable={false} />
        </aside>

        {/* ---------------- main ---------------- */}
        <div className={css.mainCol}>
          <section ref={mainRef} className={css.main} aria-labelledby="ys-ev-title" key={idx}>
            <header className={css.mainHead}>
              <RuleIcon name={cat.icon} className={css.mainIcon} />
              <h2 id="ys-ev-title">{sec.subtitle}</h2>
              {total > 1 && (
                <span className={css.count} aria-label={`Page ${idx + 1} of ${total}`}>
                  <span className={css.countSlash} aria-hidden />
                  {nn(idx + 1)} / {nn(total)}
                </span>
              )}
            </header>

            <div className={css.cols} data-single={!left.length || !right.length || undefined}>
              {[left, right].map(
                (col, c) =>
                  col.length > 0 && (
                    <div key={c} className={css.col}>
                      {col.map((b, i) => (
                        <Card key={i} b={b} />
                      ))}
                    </div>
                  ),
              )}
            </div>
          </section>

          {total > 1 && (
            <nav className={css.pager} aria-label="Rule pages">
              <button type="button" className={css.pbtn} onClick={() => go(idx - 1)} disabled={idx === 0}>
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
              <button type="button" className={css.pbtn} onClick={() => go(idx + 1)} disabled={idx === total - 1}>
                Next <Chevron dir="right" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
