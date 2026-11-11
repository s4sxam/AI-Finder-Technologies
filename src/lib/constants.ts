/**
 * Single source of truth for the site base URL across canonicals,
 * sitemap, RSS feed, OpenGraph tags, and JSON-LD structured data.
 */
export const SITE_URL: string = (
  (typeof process !== 'undefined' && (process.env.VITE_SITE_URL || process.env.VITE_APP_URL || process.env.APP_URL)) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_APP_URL)) ||
  'https://ai-finder-ruddy.vercel.app'
).replace(/\/+$/, '');
