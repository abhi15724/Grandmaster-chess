import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = pageMetadata({
  title: 'About Grandmasterchess',
  description:
    'About Grandmasterchess: a free online chess site with three AI levels, local pass-and-play, chess clocks and no forced sign-up.',

  path: '/about',
  absoluteTitle: true,
});

export default function Page() {
  return <AboutPage />;
}
