import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { TermsPage } from '@/components/pages/TermsPage';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms for using Grandmasterchess: acceptable use, accounts, advertising, disclaimers and governing law.',

  path: '/terms',
});

export default function Page() {
  return <TermsPage />;
}
