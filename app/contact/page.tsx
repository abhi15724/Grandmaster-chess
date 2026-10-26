import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ContactPage } from '@/components/pages/ContactPage';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Us for Support or Feedback',
  description:
    'Contact the Grandmasterchess team for support, feedback or bug reports about our free online chess site.',

  path: '/contact',
  absoluteTitle: true,
});

export default function Page() {
  return <ContactPage />;
}
