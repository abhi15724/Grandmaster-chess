import type { Metadata } from 'next';
import { LocalChessPage } from '@/components/pages/LocalChessPage';

import { PLAY_LOCAL_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Play Local Chess (Pass & Play) — Free, Same Device',
  description:
    'Play chess on a single device with a friend sitting next to you. Free local pass-and-play mode with full move validation and chess clocks.',
  keywords: PLAY_LOCAL_KEYWORDS,
  alternates: { canonical: '/play/local' },
};

export default function Page() {
  return <LocalChessPage />;
}
