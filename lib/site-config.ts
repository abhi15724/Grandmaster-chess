// Trailing slash stripped defensively: if NEXT_PUBLIC_SITE_URL is ever set
// with a trailing slash (e.g. "https://www.grandmasterchess.in/"), every
// `${SITE_URL}/path` concatenation below would silently produce a
// double slash (".../path"), which breaks sitemap.xml URLs and wastes
// crawl budget. Normalizing here means it's correct regardless of how
// the env var happens to be set.
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grandmasterchess.in';
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const SITE_NAME = 'Grandmasterchess - Play chess free online';

export const SITE_TAGLINE = 'Play Free Chess vs AI or Yourself on Grandmasterchess';

export const SITE_DESCRIPTION =
  'Play free online chess on grandmasterchess against yourself or challenge AI opponents across basic, intermediate and advanced difficulty levels . Chess clocks, move history, and strategy guides.';

export const TWITTER_HANDLE = '@grandmasterchess';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
