/** A run of identically-styled text. */
export type Run = {
  s: string;
  /** font family name as used in the original design */
  f?: string;
  /** font size in design px (canvas is 1366 wide) */
  z?: number;
  c?: string;
  i?: 1;
  b?: string;
  u?: 1;
  h?: string;
  ls?: string;
  lh?: string;
  g?: { a: number; s: [string, number][] };
};

export type Para = { r: Run[]; l?: string; al?: string; hd?: string };

export type Box = [top: number, left: number, width: number, height: number];

type Base = { y: number; x: number; w: number; h: number; rot?: number; op?: number };
export type TextEl = Base & { t: 'txt'; tag?: string | null; p: Para[] };
export type MediaEl = Base & { t: 'img' | 'vid'; id: string; crop: Box };
export type El = TextEl | MediaEl;

export type Bg = { c?: string; id?: string; op?: number; crop?: Box };
export type Sec = { bg?: Bg; el: El[] };
export type Page = { title: string; s: Sec[] };
export type Asset = { src: string; w: number; h: number };
export type Announcement = { title: string; text?: string; date?: string; url?: string };

/** Editable home-page settings — content/home.json */
export type HomeCfg = {
  tagline: string;
  about: { eyebrow: string; title: string; text: string };
  cards: { general: string; server: string; event: string; ticket: string; about: string };
  server: { name: string; cfxCode?: string };
  links: { discord?: string; ticket?: string; tiktok?: string; youtube?: string };
  announcements: Announcement[];
};

/** About page content — content/about.json */
export type AboutCfg = {
  intro: { title: string; paragraphs: string[] };
  story: { title: string; paragraphs: string[] };
  ranks: { title: string; text: string };
  strongest: { title: string; items: string[] };
  expect: { title: string; items: { icon: string; text: string }[] };
};

export type Site = { pages: Record<string, Page>; assets: Record<string, Asset>; home: HomeCfg; about: AboutCfg };
