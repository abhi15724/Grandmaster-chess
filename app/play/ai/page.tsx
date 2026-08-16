import type { Metadata } from 'next';
import { PlayAIPage } from '@/components/pages/PlayAIPage';

import { PLAY_AI_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Play Chess vs AI Online Free',
  description:
    'Challenge a free chess AI online. Pick basic, intermediate, or advanced difficulty and play instantly in your browser — no download, no sign-up.',
  keywords: PLAY_AI_KEYWORDS,
  alternates: { canonical: '/play/ai' },
};

export default function Page() {
  return <PlayAIPage initialDifficulty="intermediate" />;
}
