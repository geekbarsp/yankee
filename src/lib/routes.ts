/** Page slug -> document title. '' is the home page. */
export const TITLES: Record<string, string> = {
  '': 'Yankee SRP Rules Home',
  'general-rules': 'General Rules',
  'server-rules': 'Server Rules',
  'event-rules': 'Event Rules',
  'about-ysrp': 'About YSRP',
};

export const SUB_PAGES = Object.keys(TITLES).filter(Boolean);

/** Site navigation (header + footer). */
export const NAV: { slug: string; label: string }[] = [
  { slug: '', label: 'Home' },
  { slug: 'general-rules', label: 'General Rules' },
  { slug: 'server-rules', label: 'Server Rules' },
  { slug: 'event-rules', label: 'Event Rules' },
  { slug: 'about-ysrp', label: 'About' },
];

export const href = (slug: string) => (slug ? `/${slug}` : '/');
