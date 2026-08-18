import type { Metadata } from 'next';
import { TermsPage } from '@/components/pages/TermsPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: 'The terms and conditions governing your use of Grandmaster Chess Online.',
  alternates: { canonical: '/terms' },
};

export default function Page() {
  return <TermsPage />;
}
