import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = pageMetadata({
  title: 'About Us and Who Runs This Chess Site',

  description:
    'Who runs Grandmasterchess, how its chess engine and articles work, and how we keep facts accurate. Free chess vs AI or on one device, no sign-up.',

  path: '/about',
  absoluteTitle: true,
});

export default function Page() {
  return <AboutPage />;
}
