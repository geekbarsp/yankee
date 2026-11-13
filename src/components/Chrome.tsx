'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { NAV, href } from '@/lib/routes';
import type { HomeCfg } from '@/lib/types';
import { ArrowIcon, DiscordIcon, TicketIcon, TikTokIcon, YouTubeIcon } from './icons';
import css from './Chrome.module.css';
import ui from './Ui.module.css';

const mark = { '--ys-chrome': 1 } as CSSProperties;
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Wordmark({ place = 'nav' }: { place?: 'nav' | 'foot' }) {
  const px = place === 'nav' ? 88 : 72;
  return (
    <span className={`${css.wordmark} ${place === 'nav' ? css.wordmarkNav : css.wordmarkFoot}`}>
      <img src="/logo-256.png" alt="" width={px} height={px} />
      <span>
        YANKEE SCHOOL <em>RP</em>
      </span>
    </span>
  );
}

export function Socials({ links, className }: { links: HomeCfg['links']; className?: string }) {
  const items = [
    { url: links.discord, label: 'Discord', Icon: DiscordIcon },
    { url: links.tiktok, label: 'TikTok', Icon: TikTokIcon },
    { url: links.youtube, label: 'YouTube', Icon: YouTubeIcon },
  ];
  return (
    <div className={className}>
      {items.map(({ url, label, Icon }) =>
        url ? (
          <a key={label} href={url} aria-label={label} title={label} {...ext}>
            <Icon width={20} height={20} />
          </a>
        ) : (
          <span key={label} aria-disabled="true" title={`${label} — coming soon`}>
            <Icon width={20} height={20} />
          </span>
        ),
      )}
    </div>
  );
}

export function Nav({ slug, cfg }: { slug: string; cfg: HomeCfg }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { discord, ticket } = cfg.links;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [slug]);

  return (
    <header className={css.nav} data-scrolled={scrolled || undefined} style={mark}>
      <div className={css.inner}>
        <Link href="/" className={css.brand} aria-label="Yankee School RP — home">
          <Wordmark />
        </Link>
        <span className={css.divider} aria-hidden />

        <button
          type="button"
          className={css.burger}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={css.menu} data-open={open || undefined}>
          <nav className={css.links} aria-label="Main">
            {NAV.map((n) => {
              const active = n.slug === slug;
              return (
                <Link
                  key={n.slug}
                  href={href(n.slug)}
                  className={`${css.item} ${active ? `${ui.brush} ${css.active}` : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className={css.actions}>
            {ticket && (
              <a className={`${ui.btn} ${ui.outline} ${css.small}`} href={ticket} {...ext}>
                <TicketIcon /> File a Ticket
              </a>
            )}
            {discord && (
              <a className={`${ui.btn} ${ui.brush} ${css.small}`} href={discord} {...ext}>
                <DiscordIcon /> Join Discord <ArrowIcon width={16} height={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer({ cfg }: { cfg: HomeCfg }) {
  const year = new Date().getFullYear();
  return (
    <footer className={css.foot} style={mark}>
      <div className={css.footInner}>
        <Link href="/" className={css.brand} aria-label="Yankee School RP — home">
          <Wordmark place="foot" />
        </Link>
        <span className={css.divider} aria-hidden />
        <span className={css.copy}>© {year} Yankee School RP. All rights reserved.</span>

        <nav className={css.footLinks} aria-label="Footer">
          {NAV.filter((n) => n.slug).map((n) => (
            <Link key={n.slug} href={href(n.slug)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <span className={css.divider} aria-hidden />
        <Socials links={cfg.links} className={css.socials} />
      </div>
    </footer>
  );
}
