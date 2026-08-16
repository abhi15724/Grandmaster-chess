'use client';

import React from 'react';
import { formatEvalScore } from '@/lib/chess/evaluator';

interface EvaluationBarProps {
  evalScoreInCentipawns: number; // + = White, - = Black
  orientation?: 'w' | 'b';
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  evalScoreInCentipawns,
  orientation = 'w',
}) => {
  // Clamp score between -1000 and +1000 for height percentage calculation
  const clamped = Math.max(-1000, Math.min(1000, evalScoreInCentipawns));
  // 50% = 0 eval. +1000 = 95%, -1000 = 5%
  const whitePercent = 50 + (clamped / 1000) * 45;
  const displayWhitePercent = orientation === 'w' ? whitePercent : 100 - whitePercent;

  const scoreText = formatEvalScore(evalScoreInCentipawns);
  const isWhiteFavored = evalScoreInCentipawns >= 0;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Visual vertical bar */}
      <div
        className="relative w-3.5 h-[280px] sm:h-[420px] rounded-full overflow-hidden border border-zinc-700 bg-zinc-900 shadow-inner flex flex-col justify-end"
        title={`Evaluation: ${scoreText}`}
      >
        {/* White portion */}
        <div
          className="w-full bg-slate-100 transition-all duration-300 ease-out"
          style={{ height: `${displayWhitePercent}%` }}
        />
      </div>

      {/* Numeric score pill */}
      <span
        className={`font-mono-chess text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm ${
          isWhiteFavored
            ? 'bg-zinc-200 text-zinc-950'
            : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
        }`}
      >
        {scoreText}
      </span>
    </div>
  );
};
