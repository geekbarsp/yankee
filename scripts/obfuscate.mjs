// Post-build: runs javascript-obfuscator over every client chunk in ./out that
// contains this site's own code (renderer + encoded payload). Framework chunks
// (React, Next runtime) are left alone so the site stays fast.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomInt } from 'node:crypto';
import JavaScriptObfuscator from 'javascript-obfuscator';

const CHUNKS = 'out/_next/static';
if (!existsSync(CHUNKS)) {
  console.error('[obfuscate] out/ not found — run `next build` first.');
  process.exit(1);
}

// Markers that only appear in our own modules (CSS var prefix + payload start).
const blob = readFileSync('src/generated/blob.ts', 'utf8');
const firstPart = JSON.parse(blob.match(/export const d: string\[\] = (\[.*\]);/)[1])[0];
const MARKERS = ['--ys-', firstPart.slice(0, 48)];
const payloadPattern = /^[A-Za-z0-9+/=]{200,}$/; // keep big encoded payload strings intact (already encrypted)

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith('.js')) yield p;
  }
}

let count = 0;
for (const file of walk(CHUNKS)) {
  const code = readFileSync(file, 'utf8');
  if (!MARKERS.some((m) => code.includes(m))) continue;

  const result = JavaScriptObfuscator.obfuscate(code, {
    target: 'browser',
    seed: randomInt(1, 2 ** 31),
    compact: true,
    simplify: true,
    renameGlobals: false,
    selfDefending: false,
    identifierNamesGenerator: 'hexadecimal',
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.4,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.15,
    numbersToExpressions: true,
    splitStrings: true,
    splitStringsChunkLength: 6,
    stringArray: true,
    stringArrayThreshold: 1,
    stringArrayEncoding: ['base64'],
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayCallsTransform: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersType: 'function',
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    reservedStrings: [payloadPattern.source],
  });

  writeFileSync(file, result.getObfuscatedCode());
  count++;
  console.log(`[obfuscate] ${file}`);
}

if (count === 0) {
  console.error('[obfuscate] no matching chunks found — nothing was obfuscated!');
  process.exit(1);
}
console.log(`[obfuscate] done (${count} chunk${count === 1 ? '' : 's'})`);
