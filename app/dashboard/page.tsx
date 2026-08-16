import type { Metadata } from 'next';
import { DashboardPage } from '@/components/pages/DashboardPage';

export const metadata: Metadata = {
  title: 'Your Chess Dashboard — Stats & Game History',
  description: 'View your chess rating, win/loss record, and recent game history.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <DashboardPage />;
}
