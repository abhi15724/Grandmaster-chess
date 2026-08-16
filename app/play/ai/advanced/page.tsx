import type { Metadata } from 'next';
import { PlayAIPage } from '@/components/pages/PlayAIPage';

import { PLAY_AI_ADVANCED_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Play Chess vs Advanced AI (Master Level) — Free Online',
  description:
    'Play free online chess against an advanced, master-strength AI opponent. A serious tactical and strategic challenge for experienced players.',
  keywords: PLAY_AI_ADVANCED_KEYWORDS,
  alternates: { canonical: '/play/ai/advanced' },
};

export default function Page() {
  return <PlayAIPage initialDifficulty="advanced" />;
}
