'use client';

import React from 'react';
import { Timer, Clock } from 'lucide-react';

interface ChessClockProps {
  timeInSeconds: number; // 0 for untimed
  isActive: boolean;
  playerName: string;
  playerColor: 'w' | 'b';
  isUntimed?: boolean;
}

export const ChessClock: React.FC<ChessClockProps> = ({
  timeInSeconds,
  isActive,
  playerName,
  playerColor,
  isUntimed = false,
}) => {
  const isLowTime = !isUntimed && timeInSeconds <= 30 && timeInSeconds > 0;
  const isCriticalTime = !isUntimed && timeInSeconds <= 10 && timeInSeconds > 0;

  const formatTime = (totalSecs: number) => {
    if (isUntimed || totalSecs <= 0 && isUntimed) return '∞';
    const minutes = Math.floor(Math.max(0, totalSecs) / 60);
    const seconds = Math.floor(Math.max(0, totalSecs) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 ${
        isActive
          ? isCriticalTime
            ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50 shadow-md shadow-rose-950/50'
            : 'bg-[#211f1c] border-[#81b64c] ring-1 ring-[#81b64c]/40 shadow-sm'
          : 'bg-[#211f1c] border-[#3c3934] opacity-80'
      }`}
    >
      {/* Player identity */}
      <div className="flex items-center gap-2">
        <div
          className={`h-3.5 w-3.5 rounded-full border ${
            playerColor === 'w' ? 'bg-[#f0f0f0] border-zinc-400' : 'bg-[#161512] border-zinc-700'
          }`}
        />
        <span className="text-xs font-bold text-zinc-200 truncate max-w-[120px] sm:max-w-[160px]">
          {playerName}
        </span>
      </div>

      {/* Clock display */}
      <div className="flex items-center gap-1.5 bg-[#161512] px-2.5 py-1 rounded border border-[#3c3934]/70">
        <Clock
          className={`h-3.5 w-3.5 ${
            isActive
              ? isCriticalTime
                ? 'text-rose-400 animate-spin'
                : 'text-[#81b64c]'
              : 'text-zinc-500'
          }`}
        />
        <span
          className={`font-mono-chess font-bold text-sm tracking-wider ${
            isCriticalTime
              ? 'text-rose-400 animate-pulse'
              : isLowTime
              ? 'text-amber-300'
              : isActive
              ? 'text-[#81b64c]'
              : 'text-zinc-400'
          }`}
        >
          {formatTime(timeInSeconds)}
        </span>
      </div>
    </div>
  );
};

