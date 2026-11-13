# Yankee SRP Rules site (Next.js)

Next.js rebuild of `yankeeschoolrp.my.canva.site`, exported as a fully static site.

## Commands

```bash
npm install
npm run dev       # local dev server at http://localhost:3000
npm run build     # encode content, run next build, then obfuscate → ./out
npm run preview   # serve ./out locally
```

Deploy the `out/` folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages and others).

## Editing content

All page text, links and layout live in `content/site.json`, which was extracted from the Canva design:

- Every page holds sections, and each section is a 1366×768 canvas.
- Each element (`txt` / `img` / `vid`) has a design-pixel position (`x`, `y`, `w`, `h`).
- Text is stored as paragraphs (`p`) made of styled runs (`r`). Run fields:
  - `s`: text
  - `f`: font
  - `z`: size
  - `c`: color
  - `h`: link
  - `g`: gradient

Edit that file and rebuild. Images are in `public/m/`.

## How the obfuscation works

1. **Content is never in the HTML.** `scripts/encode-content.mjs` XOR-encrypts `site.json` with a new random key on every build. The page decodes it in the browser after load, so "View source" and crawlers see no rule text.
2. **The site's own code is obfuscated.** After `next build`, `scripts/obfuscate.mjs` runs `javascript-obfuscator` on each client chunk that holds the site's code. It applies control-flow flattening, string-array encoding and renamed identifiers. React and Next runtime chunks are left alone to keep the site fast.
3. **Nothing readable is shipped:**
   - There are no source maps.
   - CSS-module class names are hashed.
   - Right-click is disabled on images, as on the original site.

This is a deterrent, not real protection. Anything a browser can display, a determined person can still read from the running page.

## Fonts

- **Anton:** the italic file from the original design (SIL OFL).
- **Arimo:** Google Fonts. It is metric-compatible with Arial and replaces Arial MT Pro.
- **Krona One:** Google Fonts. It replaces the licensed "Horizon" font used for event names.
