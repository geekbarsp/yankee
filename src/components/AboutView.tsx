'use client';

import type { ReactNode, SVGProps } from 'react';
import type { AboutCfg } from '@/lib/types';
import css from './AboutView.module.css';

type P = SVGProps<SVGSVGElement>;
const svg = (p: P): P => ({
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...p,
});

/* Filled glyphs for the "What you can expect" list, line art for the big tiles. */
const ICONS: Record<string, ReactNode> = {
  users: (
    <g fill="currentColor" stroke="none">
      <circle cx="12" cy="7.5" r="3.2" />
      <circle cx="5.2" cy="9" r="2.3" />
      <circle cx="18.8" cy="9" r="2.3" />
      <path d="M6.3 19.5c.3-3.6 2.7-6 5.7-6s5.4 2.4 5.7 6zM1 18.5c.2-2.5 1.7-4.3 3.8-4.3 1 0 1.8.3 2.4.9-1 1-1.6 2.2-1.8 3.4zM23 18.5c-.2-2.5-1.7-4.3-3.8-4.3-1 0-1.8.3-2.4.9 1 1 1.6 2.2 1.8 3.4z" />
    </g>
  ),
  group: (
    <g fill="currentColor" stroke="none">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M2 19c.3-3.4 2.7-5.6 6-5.6 1.6 0 3 .5 4 1.5 1-1 2.4-1.5 4-1.5 3.3 0 5.7 2.2 6 5.6z" />
    </g>
  ),
  swords: <path d="M4 4l11 11M20 4 9 15M13 17l4 4M7 21l4-4M15.5 12.5l4 4M4.5 16.5l4-4" strokeWidth={2.2} />,
  school: (
    <g fill="currentColor" stroke="none">
      <path d="M12 2.5l1.6 1V6h-1.2V4.3l-.4-.3-.4.3V6h-1.2V3.5z" />
      <path d="M8 7h8v4h5v10H3V11h5zm2.5 9v5h3v-5zM5 13v2h2v-2zm0 4v2h2v-2zm12-4v2h2v-2zm0 4v2h2v-2zM10.5 9v2h3V9z" fillRule="evenodd" />
    </g>
  ),
  star: <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="currentColor" stroke="none" />,
  torii: (
    <g fill="currentColor" stroke="none">
      <path d="M2 4.2c3.5.9 6.8 1.3 10 1.3s6.5-.4 10-1.3l-.6 2.4c-.6.2-1.2.3-1.9.4V9h-2V7.3c-1.2.1-2.4.2-3.5.2V9h-4V7.5c-1.1 0-2.3-.1-3.5-.2V9h-2V7c-.7-.1-1.3-.2-1.9-.4z" />
      <path d="M3.5 10h17v2h-1.9v9h-2.2v-9H7.6v9H5.4v-9H3.5z" />
    </g>
  ),
  car: (
    <g fill="currentColor" stroke="none">
      <path d="M6.2 6.5h9.3c.8 0 1.5.4 1.9 1.1l1.9 3.1c1.6.3 2.7 1.3 2.7 2.8V17h-2.3a2.6 2.6 0 0 0-5.1 0H9.4a2.6 2.6 0 0 0-5.1 0H2v-4.2c0-1.1.8-2 1.9-2.1zm.9 1.8-1.2 2.3h5.2V8.3zm5.8 0v2.3h4.7l-1.3-2.3z" fillRule="evenodd" />
      <circle cx="6.9" cy="17.4" r="1.7" />
      <circle cx="17.2" cy="17.4" r="1.7" />
    </g>
  ),
  gear: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      d="M10.3 2h3.4l.5 2.6c.7.2 1.3.5 1.9.9l2.4-1.2 2.4 2.4-1.2 2.4c.4.6.7 1.2.9 1.9l2.6.5v3.4l-2.6.5c-.2.7-.5 1.3-.9 1.9l1.2 2.4-2.4 2.4-2.4-1.2c-.6.4-1.2.7-1.9.9l-.5 2.6h-3.4l-.5-2.6c-.7-.2-1.3-.5-1.9-.9l-2.4 1.2-2.4-2.4 1.2-2.4c-.4-.6-.7-1.2-.9-1.9L2 13.7v-3.4l2.6-.5c.2-.7.5-1.3.9-1.9L4.3 5.5l2.4-2.4 2.4 1.2c.6-.4 1.2-.7 1.9-.9zM12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z"
    />
  ),
  sakura: (
    <g fill="currentColor" stroke="none">
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a} 12 12)`} d="M12 11c-2.2-1.5-3.3-3.6-3-5.8.3-1.5 1.5-2.6 3-2.6l-.2 1.6L13 2.6c1.5 0 2.7 1.1 3 2.6.3 2.2-.8 4.3-3 5.8z" />
      ))}
      <circle cx="12" cy="12" r="1.6" fill="#0d0d0f" />
    </g>
  ),
  trophy: (
    <path
      fill="currentColor"
      stroke="none"
      d="M6 3h12v2h3.2v1.5a4.7 4.7 0 0 1-4 4.6A6 6 0 0 1 13.2 15v2.5H16V21H8v-3.5h2.8V15a6 6 0 0 1-4-3.9 4.7 4.7 0 0 1-4-4.6V5H6zm0 3.6v-.1H4.5a3 3 0 0 0 1.6 2.6A6 6 0 0 1 6 6.6zm12-.1v.1c0 .9-.1 1.7-.1 2.5a3 3 0 0 0 1.6-2.6z"
    />
  ),
  flame: (
    <g fill="currentColor" stroke="none">
      <path d="M13.5 1.5c.6 3.2 2.6 4.8 4.2 6.9 1.4 1.8 2.3 3.8 2.3 6.1 0 4.6-3.6 8-8 8s-8-3.4-8-8c0-2.4.9-4.4 2.4-6 .2 1.6.9 2.8 2 3.6-.3-3.9 1.5-7.6 5.1-10.6z" />
      <path
        fill="#b5121b"
        d="M12.2 11.2c.3 1.7 1.3 2.6 2.1 3.6.7.9 1.2 1.8 1.2 3 0 2-1.6 3.4-3.5 3.4s-3.5-1.4-3.5-3.4c0-1.1.4-2 1.1-2.8.1.8.5 1.4 1 1.8-.1-2 .5-4 1.6-5.6z"
      />
    </g>
  ),
  /* large tiles */
  summit: (
    <>
      <path d="M2.5 20.5 11 7l8.5 13.5" />
      <path d="M7 13.4l2 1.6 2-1.6 2 1.6 2-1.6" />
      <path d="M11 7V2.5h6.5l-1.6 2 1.6 2H11" />
    </>
  ),
  cap: (
    <>
      <path d="M1.5 9.5 12 5l10.5 4.5L12 14z" />
      <path d="M6 11.6v4.2c1.6 1.6 3.6 2.4 6 2.4s4.4-.8 6-2.4v-4.2" />
      <path d="M22.5 9.5v5.5" />
    </>
  ),
};

const Icon = ({ name, ...p }: { name: string } & P) => <svg {...svg(p)}>{ICONS[name] ?? ICONS.star}</svg>;

export default function AboutView({ about }: { about: AboutCfg }) {
  const items = about.expect.items;
  const half = Math.ceil(items.length / 2);

  return (
    <div className={css.page}>
      <header className={css.banner}>
        <img src="/m/about-banner.jpg" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
        <h1 className={css.srOnly}>About Yankee RP</h1>
      </header>

      <div className={css.grid}>
        {/* ---------------- left panel ---------------- */}
        <section className={css.panel} aria-labelledby="ys-ab-intro">
          <h2 id="ys-ab-intro" className={css.ribbon}>
            {about.intro.title}
          </h2>
          <div className={css.prose}>
            {about.intro.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>

          <hr className={css.rule} />

          <h3 className={css.slashHead}>
            <span aria-hidden className={css.slash} />
            {about.story.title}
          </h3>
          <div className={css.prose}>
            {about.story.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </section>

        {/* ---------------- right column ---------------- */}
        <div className={css.right}>
          <section className={css.card} aria-labelledby="ys-ab-ranks">
            <div className={css.tile}>
              <Icon name="summit" />
            </div>
            <div>
              <h2 id="ys-ab-ranks" className={css.cardTitle}>
                {about.ranks.title}
              </h2>
              <p className={css.cardText}>{about.ranks.text}</p>
            </div>
          </section>

          <section className={css.card} aria-labelledby="ys-ab-strong">
            <div className={css.tile}>
              <Icon name="cap" />
            </div>
            <div>
              <h2 id="ys-ab-strong" className={css.cardTitle}>
                {about.strongest.title}
              </h2>
              <ul className={css.tri}>
                {about.strongest.items.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={css.expect} aria-labelledby="ys-ab-expect">
            <h2 id="ys-ab-expect" className={css.expectRibbon}>
              <Icon name="flame" className={css.flame} />
              {about.expect.title}
            </h2>
            <div className={css.expectCols}>
              {[items.slice(0, half), items.slice(half)].map((col, c) => (
                <ul key={c} className={css.expectList}>
                  {col.map((it, i) => (
                    <li key={i}>
                      <Icon name={it.icon} className={css.expectIcon} />
                      <span>{it.text}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className={css.foot} aria-hidden>
        <img src="/m/about-foot.jpg" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
      </div>
    </div>
  );
}
