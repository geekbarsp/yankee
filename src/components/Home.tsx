'use client';

import Link from 'next/link';
import { useEffect, useState, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import type { Announcement, HomeCfg } from '@/lib/types';
import {
  ArrowIcon,
  DiscordIcon,
  ServerIcon,
  TicketIcon,
  TikTokIcon,
  UsersIcon,
  WifiIcon,
  YouTubeIcon,
} from './icons';
import css from './Home.module.css';
import ui from './Ui.module.css';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/* ---------------------------------------------------------------- cards */

type Card = { title: string; sub: string; to?: string; external?: boolean; img: string };

function QuickCard({ c }: { c: Card }) {
  const body = (
    <>
      <span className={css.cardArt} style={{ backgroundImage: `url(${c.img})` } as CSSProperties} aria-hidden />
      <span className={css.cardTitle}>{c.title}</span>
      <span className={css.cardSub}>{c.sub}</span>
      <span className={css.corner} aria-hidden>
        <ArrowIcon width={18} height={18} />
      </span>
    </>
  );
  if (c.external) {
    return (
      <a className={css.card} href={c.to} {...ext}>
        {body}
      </a>
    );
  }
  return (
    <Link className={css.card} href={c.to!}>
      {body}
    </Link>
  );
}

/* ---------------------------------------------------------------- server status */

type Status =
  | { s: 'idle' | 'loading' | 'offline' | 'unavailable' }
  | { s: 'online'; players: number; max?: number; ping: number };

const STATE_LABEL: Record<Status['s'], string> = {
  idle: 'Not set up',
  loading: 'Checking',
  online: 'Online',
  offline: 'Offline',
  unavailable: 'Unavailable',
};

function ServerStatus({ server }: { server: HomeCfg['server'] }) {
  const code = server.cfxCode?.trim();
  const [st, setSt] = useState<Status>({ s: code ? 'loading' : 'idle' });

  useEffect(() => {
    if (!code) return;
    let alive = true;
    const load = () => {
      const t0 = performance.now();
      fetch(`https://frontend.cfx-services.net/api/servers/single/${encodeURIComponent(code)}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((j) => {
          if (!alive) return;
          const d = j?.Data;
          if (!d) return setSt({ s: 'offline' });
          const max = Number(d.sv_maxclients ?? d.vars?.sv_maxClients);
          setSt({
            s: 'online',
            players: Number(d.clients) || 0,
            max: Number.isFinite(max) ? max : undefined,
            ping: Math.round(performance.now() - t0),
          });
        })
        .catch(() => alive && setSt({ s: 'unavailable' }));
    };
    load();
    const t = window.setInterval(load, 60_000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, [code]);

  const online = st.s === 'online' ? st : null;
  const rows: { Icon: Icon; label: string; value: string }[] = [
    { Icon: UsersIcon, label: 'Players', value: online ? `${online.players}${online.max ? ` / ${online.max}` : ''}` : '—' },
    { Icon: WifiIcon, label: 'Ping', value: online ? `${online.ping} ms` : '—' },
    { Icon: ServerIcon, label: 'Server', value: server.name },
  ];

  return (
    <section className={`${css.panel} ${css.status}`} aria-labelledby="ys-status">
      <header className={css.panelHead}>
        <h2 id="ys-status" className={css.panelTitle}>
          Server Status
        </h2>
        <span className={css.state} data-s={st.s}>
          {STATE_LABEL[st.s]}
        </span>
      </header>
      <dl className={css.rows}>
        {rows.map(({ Icon, label, value }) => (
          <div key={label} className={css.row}>
            <dt>
              <Icon width={17} height={17} /> {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------------------------------------------------------------- quick links */

export const SOCIALS = (links: HomeCfg['links']): { url?: string; label: string; Icon: Icon }[] => [
  { url: links.discord, label: 'Discord', Icon: DiscordIcon },
  { url: links.tiktok, label: 'TikTok', Icon: TikTokIcon },
  { url: links.youtube, label: 'YouTube', Icon: YouTubeIcon },
];

function QuickLinks({ links }: { links: HomeCfg['links'] }) {
  return (
    <section className={`${css.panel} ${css.quick}`} aria-labelledby="ys-quick">
      <header className={`${css.panelHead} ${css.bar}`}>
        <h2 id="ys-quick" className={css.panelTitle}>
          Quick Links
        </h2>
      </header>
      <div className={css.tiles}>
        {SOCIALS(links).map(({ url, label, Icon }) =>
          url ? (
            <a key={label} className={css.tile} href={url} aria-label={label} title={label} {...ext}>
              <Icon width={22} height={22} />
            </a>
          ) : (
            <span key={label} className={css.tile} aria-disabled="true" title={`${label} — coming soon`}>
              <Icon width={22} height={22} />
            </span>
          ),
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- announcements */

function fmtDate(d?: string) {
  if (!d) return '';
  const t = new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d);
  if (Number.isNaN(t.getTime())) return d;
  return t.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
}

function Announcements({ items, discord }: { items: Announcement[]; discord?: string }) {
  return (
    <section className={`${css.panel} ${css.news}`} aria-labelledby="ys-news">
      <header className={`${css.panelHead} ${css.bar}`}>
        <h2 id="ys-news" className={css.panelTitle}>
          Latest Announcements
        </h2>
        {discord && (
          <a className={css.viewAll} href={discord} {...ext}>
            View all <ArrowIcon width={15} height={15} />
          </a>
        )}
      </header>
      {items.length ? (
        <ul className={css.newsList}>
          {items.slice(0, 3).map((a, i) => (
            <li key={i}>
              <span className={css.slash} aria-hidden />
              <div>
                <h3 className={css.newsTitle}>
                  {a.url ? (
                    <a href={a.url} {...ext}>
                      {a.title}
                    </a>
                  ) : (
                    a.title
                  )}
                </h3>
                {a.text && <p className={css.newsText}>{a.text}</p>}
              </div>
              {a.date && <time dateTime={a.date}>{fmtDate(a.date)}</time>}
            </li>
          ))}
        </ul>
      ) : (
        <div className={css.empty}>
          <span className={css.soonTag}>
            <span className={css.slash} aria-hidden /> Stay tuned
          </span>
          <strong>Coming Soon</strong>
          <span>Server updates, events and patch notes will be posted here. Until then, catch the latest news in our Discord.</span>
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- page */

export default function HomeView({ cfg }: { cfg: HomeCfg }) {
  const { discord, ticket } = cfg.links;
  const cards: Card[] = [
    { title: 'General Rules', sub: cfg.cards.general, to: '/general-rules', img: '/m/card-general.jpg' },
    { title: 'Server Rules', sub: cfg.cards.server, to: '/server-rules', img: '/m/card-server.jpg' },
    { title: 'Event Rules', sub: cfg.cards.event, to: '/event-rules', img: '/m/card-event.jpg' },
    { title: 'File a Ticket', sub: cfg.cards.ticket, to: ticket, external: true, img: '/m/card-ticket.jpg' },
    { title: 'About', sub: cfg.cards.about, to: '/about-ysrp', img: '/m/card-about.jpg' },
  ];

  return (
    <div className={css.home}>
      <section className={css.hero}>
        <h1 className={css.srOnly}>Yankee School Roleplay</h1>
        <div className={css.heroMedia}>
          <img
            className={css.heroArt}
            src="/m/hero.jpg"
            alt=""
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className={css.heroMask} aria-hidden />
        </div>
        {/* On desktop the tagline + buttons painted in hero.jpg are shown as-is;
            these live elements sit exactly on top of them (invisible, clickable).
            On phones the art is cropped above them and these become visible. */}
        <p className={css.tagline}>{cfg.tagline}</p>
        <div className={css.ctas}>
          {discord && (
            <a className={`${ui.btn} ${ui.brush} ${css.heroBtn} ${css.btnDiscord}`} href={discord} {...ext}>
              <DiscordIcon className={css.heroIcon} /> <span>Join our Discord</span>
            </a>
          )}
          {ticket && (
            <a className={`${ui.btn} ${ui.outline} ${css.heroBtn} ${css.btnTicket}`} href={ticket} {...ext}>
              <TicketIcon className={css.heroIcon} /> <span>File a Ticket</span>
            </a>
          )}
        </div>
      </section>

      <div className={css.wrap}>
        <nav className={css.cards} aria-label="Quick navigation">
          {cards
            .filter((c) => c.to)
            .map((c) => (
              <QuickCard key={c.title} c={c} />
            ))}
        </nav>

        <div className={css.grid}>
          <section className={`${css.panel} ${css.about}`} aria-labelledby="ys-about">
            <span className={css.aboutArt} aria-hidden />
            <div className={css.aboutBody}>
              <p className={css.eyebrow}>{cfg.about.eyebrow}</p>
              <h2 id="ys-about" className={css.aboutTitle}>
                {cfg.about.title}
              </h2>
              <p className={css.aboutText}>{cfg.about.text}</p>
              <Link className={`${ui.btn} ${ui.brush} ${css.learn}`} href="/about-ysrp">
                Learn more <ArrowIcon width={18} height={18} />
              </Link>
            </div>
          </section>

          <div className={css.mid}>
            <ServerStatus server={cfg.server} />
            <QuickLinks links={cfg.links} />
          </div>

          <Announcements items={cfg.announcements} discord={discord} />
        </div>
      </div>
    </div>
  );
}
