import localFont from 'next/font/local';
import { Arimo, Krona_One, Oswald } from 'next/font/google';

// Condensed UI face for navigation, buttons and panel headings.
export const ui = Oswald({
  subsets: ['latin'],
  variable: '--ys-f-ui',
  display: 'swap',
});

// Anton (italic cut, as used in the original design) — SIL Open Font License.
// The design only has the italic face, so it is registered for both styles.
export const anton = localFont({
  src: [
    { path: '../fonts/anton-italic.woff', weight: '400', style: 'normal' },
    { path: '../fonts/anton-italic.woff', weight: '400', style: 'italic' },
  ],
  variable: '--ys-f-display',
  display: 'swap',
});

// Arimo is metric-compatible with Arial (stands in for Arial MT Pro too).
export const arimo = Arimo({
  subsets: ['latin'],
  variable: '--ys-f-body',
  display: 'swap',
});

// Wide display face standing in for "Horizon" (event names).
export const wide = Krona_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--ys-f-wide',
  display: 'swap',
});
