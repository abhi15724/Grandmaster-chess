import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { SITE_NAME } from '@/lib/site-config';
import { HOME_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: `${SITE_NAME} | Play Free Chess vs AI or Yourself`,
  description:
    'Play free online chess against yourself or challenge AI opponents across basic, intermediate and advanced difficulty levels. Chess clocks, move history, and strategy guides.',
  keywords: HOME_KEYWORDS,
  alternates: { canonical: '/' },
};

export default function Page() {
  return <HomePage />;
}
