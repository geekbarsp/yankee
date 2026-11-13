/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site in ./out — host it anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages…)
  output: 'export',
  reactStrictMode: true,
  // Never ship readable source to the browser
  productionBrowserSourceMaps: false,
  images: { unoptimized: true },
};

export default nextConfig;
