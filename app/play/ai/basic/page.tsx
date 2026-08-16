import type { Metadata } from 'next';
import { PlayAIPage } from '@/components/pages/PlayAIPage';

import { PLAY_AI_BASIC_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Play Chess vs Basic AI (Beginner Level) — Free Online',
  description:
    'Play free online chess against a beginner-friendly AI opponent. Perfect for learning openings, basic tactics, and getting comfortable with the rules.',
  keywords: PLAY_AI_BASIC_KEYWORDS,
  alternates: { canonical: '/play/ai/basic' },
};

export default function Page() {
  return <PlayAIPage initialDifficulty="basic" />;
}
