import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PrivacyPage } from '@/components/pages/PrivacyPage';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Grandmasterchess collects, uses and protects your information.',

  path: '/privacy',
});

export default function Page() {
  return <PrivacyPage />;
}
