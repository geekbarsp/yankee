import type { ReactNode, SVGProps } from 'react';
import type { IconKey } from '@/lib/rules';

const PATHS: Record<IconKey, ReactNode> = {
  chat: (
    <>
      <path d="M4 5h16v10H10l-5 4v-4H4z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  wave: <path d="M3 12h1.5M6.5 9v6M9.5 6v12M12.5 9v6M15.5 4v16M18.5 8v8M21 12h-.5" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6M9 7h1.5M9 10h1.5" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="8" r="3" />
      <circle cx="5.5" cy="10" r="2.2" />
      <circle cx="18.5" cy="10" r="2.2" />
      <path d="M6.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5M1.8 18c.3-2 1.6-3.4 3.4-3.6M22.2 18c-.3-2-1.6-3.4-3.4-3.6" />
    </>
  ),
  idcard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.8 16c.6-1.7 1.8-2.5 3.2-2.5s2.6.8 3.2 2.5M14.5 10h4M14.5 13.5h3" />
    </>
  ),
  ear: (
    <>
      <path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 .5" />
      <path d="M10 9.5a2 2 0 0 1 4 0c0 1.2-1 1.6-1.5 2.5" />
    </>
  ),
  mask: (
    <>
      <path d="M3 6c3 1.5 6 1.5 9 0 3 1.5 6 1.5 9 0v5c0 5-4.5 8-9 9-4.5-1-9-4-9-9z" />
      <path d="M7 11.5c1 .8 2.2.8 3 0M14 11.5c1 .8 2.2.8 3 0M9.5 16c1.5 1 3.5 1 5 0" />
    </>
  ),
  logout: <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <path d="M8 8.2 20 18M8 15.8 20 6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z" />
      <circle cx="12" cy="13.2" r="3.4" />
    </>
  ),
  hand: (
    <path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.6 0-4-1.5-5.4-3.6L4 14.3a1.5 1.5 0 0 1 2.4-1.8L8 14" />
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5 21 7.5v9l-5-3" />
    </>
  ),
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  crosshair: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  heart: <path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.9C20 15.2 12 20 12 20z" />,
  skull: (
    <>
      <path d="M12 3c-4.7 0-8 3.2-8 7.6 0 2.6 1.2 4.3 3 5.2V19h10v-3.2c1.8-.9 3-2.6 3-5.2C20 6.2 16.7 3 12 3z" />
      <circle cx="9" cy="11" r="1.6" />
      <circle cx="15" cy="11" r="1.6" />
      <path d="M10.5 19v-2M13.5 19v-2" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </>
  ),
  refresh: <path d="M20 11a8 8 0 0 0-14.3-4.3L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.3 4.3L20 15.5M20 20v-4.5h-4.5" />,
  alert: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 9.5v5M12 17.5h.01" />
    </>
  ),
  bluetooth: <path d="M7 7l10 10-5 4V3l5 4L7 17" />,
  gavel: <path d="M13.5 3.5l7 7M10 7l7 7M12 5.5l-5 5M18.5 12l-5 5M9 12.5 3 18.5l2.5 2.5 6-6M13 21h8" />,
  swords: <path d="M4 4l11 11M20 4 9 15M13 17l4 4M7 21l4-4M15.5 12.5l4 4M4.5 16.5l4-4" />,
  trophy: <path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v3M8 21h8M9 21v-2h6v2" />,
  run: (
    <>
      <circle cx="14.5" cy="4" r="1.9" />
      <path d="M9 21l3-6 3 2.5V22M6.5 11.5 9 8l4.5-.5 2.5 3.5 3 1M12 15l1.5-7.5M13.5 7.5 10 15l-4.5.5" />
    </>
  ),
  school: (
    <>
      <path d="M12 2.5v4M12 2.5h3.5l-1 1 1 1H12" />
      <path d="M7 10.5 12 6.5l5 4V21H7z" />
      <path d="M2.5 21V13h4.5M21.5 21V13H17M1.5 21h21M10.5 21v-4h3v4M10.5 12h3M4.5 16h1M18.5 16h1" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 2H4.2z" />
      <path d="M10 21a2 2 0 0 0 4 0M12 3v2M3.5 8.5 2 7.5M20.5 8.5 22 7.5" />
    </>
  ),
  crown: (
    <>
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z" />
      <path d="M5 21h14" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V3.5" />
      <path d="M5 4h13l-2.5 4.5L18 13H5" />
    </>
  ),
  theater: (
    <>
      <path d="M2.5 4.5c2.6 1 5.4 1 8 0v5.2c0 3-1.8 5.1-4 5.8-2.2-.7-4-2.8-4-5.8z" />
      <path d="M4.6 8.2c.5.4 1.2.4 1.7 0M7 8.2c.5.4 1.2.4 1.7 0M4.8 11.4c.9-.8 2.5-.8 3.4 0" />
      <path d="M12.6 9.6c2.7.9 5.6.9 8.4-.1l.1 5.3c0 3.1-1.9 5.2-4.2 5.9-2.3-.7-4.2-2.8-4.2-5.9z" />
      <path d="M14.7 13.1c.5-.4 1.2-.4 1.7 0M17.2 13.1c.5-.4 1.2-.4 1.7 0M15 16.2c.9.8 2.5.8 3.4 0" />
    </>
  ),
  gamepad: (
    <>
      <path d="M7 7h10a5 5 0 0 1 4.8 6.4l-1 3.4a2.4 2.4 0 0 1-4.1 1L15 16H9l-1.7 1.8a2.4 2.4 0 0 1-4.1-1l-1-3.4A5 5 0 0 1 7 7z" />
      <path d="M7.5 10v4M5.5 12h4" />
      <circle cx="16" cy="11" r=".9" fill="currentColor" />
      <circle cx="18" cy="13" r=".9" fill="currentColor" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

export function RuleIcon({ name, ...p }: { name: IconKey } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={42}
      height={42}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...p}
    >
      {PATHS[name]}
    </svg>
  );
}
