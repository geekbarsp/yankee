import { k, d } from '@/generated/blob';
import type { Site } from './types';

let cache: Site | null = null;

/** Decodes the build-time encoded site payload (browser only). */
export function loadSite(): Site {
  if (cache) return cache;
  const key = Uint8Array.from(atob(k), (ch) => ch.charCodeAt(0));
  const raw = atob(d.slice().reverse().join(''));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    out[i] = raw.charCodeAt(i) ^ key[i % key.length] ^ ((i * 131) & 255);
  }
  cache = JSON.parse(new TextDecoder().decode(out)) as Site;
  return cache;
}
