// Trailing slash stripped defensively so `${SITE_URL}/path` never yields "//".
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grandmasterchess.in';
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

/** Entity name used in schema.org + og:site_name. Keep it short and brand-only:
 *  Google builds the site name from WebSite.name, not from long marketing strings. */
export const SITE_NAME = 'Grandmaster Chess';

/** One-word brand used as the title suffix ("... | Grandmasterchess") so the
 *  brand query "grandmasterchess" is reinforced on every page. */
export const SITE_BRAND = 'Grandmasterchess';

/** Alternate spellings people type; fed to WebSite/Organization.alternateName. */
export const SITE_ALT_NAMES = [
  'Grandmasterchess',
  'GrandmasterChess',
  'Grandmaster Chess Online',
  'grandmasterchess.in',
];

export const SITE_TAGLINE = 'Play Chess Online Free';

// <=160 chars so Google doesn't truncate it.
export const SITE_DESCRIPTION =
  'Play chess online free on Grandmasterchess: challenge a chess AI at 3 levels or play 2-player locally. Chess clocks, PGN export, no sign-up needed.';

export const TWITTER_HANDLE = '@grandmasterchess';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
