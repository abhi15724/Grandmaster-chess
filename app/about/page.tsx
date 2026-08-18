import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description:
    'Learn about Grandmaster Chess Online — a free, no-login-required chess platform with a tiered AI engine and local pass-and-play.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <AboutPage />;
}
