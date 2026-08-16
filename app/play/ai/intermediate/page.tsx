import type { Metadata } from 'next';
import { PlayAIPage } from '@/components/pages/PlayAIPage';

import { PLAY_AI_INTERMEDIATE_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Play Chess vs Intermediate AI (Casual Level) — Free Online',
  description:
    'Play free online chess against an intermediate AI opponent — a solid, casual-strength challenge for players comfortable with the basics.',
  keywords: PLAY_AI_INTERMEDIATE_KEYWORDS,
  alternates: { canonical: '/play/ai/intermediate' },
};

export default function Page() {
  return <PlayAIPage initialDifficulty="intermediate" />;
}
