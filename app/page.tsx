import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { SITE_NAME } from '@/lib/site-config';
import { HOME_KEYWORDS } from '@/lib/seo-keywords';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: `${SITE_NAME} | Play Free Chess vs AI or Yourself`,
  description:
    'Play free online chess vs AI or yourself — 3 AI difficulty levels, chess clocks, move history, no registration required.',
  keywords: HOME_KEYWORDS,
  alternates: { canonical: '/' },
};

export default function Page() {
  const latestPosts = getAllPosts().slice(0, 3);
  return <HomePage latestPosts={latestPosts} />;
}
