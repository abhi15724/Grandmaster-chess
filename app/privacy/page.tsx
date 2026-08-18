import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: 'How Grandmaster Chess Online collects, uses, and protects your information.',
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return <PrivacyPage />;
}
