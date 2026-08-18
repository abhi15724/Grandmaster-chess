import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/ContactPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description: 'Get in touch with the Grandmaster Chess Online team for support, feedback, or bug reports.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
