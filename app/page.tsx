import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HomePage } from '@/components/pages/HomePage';
import { HOME_KEYWORDS } from '@/lib/seo-keywords';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = pageMetadata({
  title: 'Play Chess Online Free | Grandmasterchess',
  description:
    'Play chess online free on Grandmasterchess: vs AI at 3 levels or 2-player on one device. Chess clocks, move history, PGN export. No sign-up.',
  keywords: HOME_KEYWORDS,
  path: '/',
  absoluteTitle: true,
});

export default function Page() {
  const latestPosts = getAllPosts().slice(0, 3);
  return <HomePage latestPosts={latestPosts} />;
}
