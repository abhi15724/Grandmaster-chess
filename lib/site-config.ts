export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grandmasterchess.in';

export const SITE_NAME = 'Grandmaster Chess Online';

export const SITE_TAGLINE = 'Play Free Chess vs AI or Yourself';

export const SITE_DESCRIPTION =
  'Play free online chess against yourself or challenge AI opponents across basic, intermediate and advanced difficulty levels. Chess clocks, move history, and strategy guides.';

export const TWITTER_HANDLE = '@grandmasterchess';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
