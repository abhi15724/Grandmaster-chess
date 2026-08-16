'use client';

import React, { useRef, useEffect } from 'react';
import { Copy, Download, Check, History } from 'lucide-react';
import { MoveRecord } from '@/types/chess';
import { downloadPgnFile } from '@/lib/storage';

interface MoveHistoryProps {
  moves: MoveRecord[];
  pgn: string;
  currentMoveIndex?: number;
  onSelectMove?: (index: number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  pgn,
  currentMoveIndex,
  onSelectMove,
}) => {
  const [copied, setCopied] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group into turns (White move + Black move)
  const turns: Array<{ turnNum: number; white?: MoveRecord; black?: MoveRecord; whiteIdx: number; blackIdx?: number }> = [];
  for (let i = 0; i < moves.length; i += 2) {
    turns.push({
      turnNum: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
      whiteIdx: i,
      blackIdx: i + 1 < moves.length ? i + 1 : undefined,
    });
  }

  // Auto-scroll to bottom on new moves
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  const handleCopyPgn = () => {
    if (!pgn && moves.length === 0) return;
    navigator.clipboard.writeText(pgn || '1. e4');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPgn = () => {
    if (!pgn && moves.length === 0) return;
    downloadPgnFile(pgn || '1. e4', `chess_game_${Date.now()}.pgn`);
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-[#3c3934] bg-[#262421] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#3c3934] bg-[#211f1c]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 uppercase tracking-wider">
          <History className="h-3.5 w-3.5 text-[#81b64c]" />
          <span>Notation ({moves.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyPgn}
            aria-label="Copy PGN to clipboard"
            disabled={moves.length === 0}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-zinc-300 bg-[#3c3934] hover:bg-[#4a4641] hover:text-white rounded border border-[#3c3934] disabled:opacity-40 transition-colors"
            title="Copy PGN"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'PGN'}</span>
          </button>
          <button
            onClick={handleDownloadPgn}
            aria-label="Download PGN file"
            disabled={moves.length === 0}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-zinc-300 bg-[#3c3934] hover:bg-[#4a4641] hover:text-white rounded border border-[#3c3934] disabled:opacity-40 transition-colors"
            title="Download PGN File"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Move list table */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-1.5 space-y-0.5 font-mono-chess text-xs min-h-[140px] max-h-[220px] sm:max-h-[280px] bg-[#161512]/50"
      >
        {turns.length === 0 ? (
          <div className="flex h-full items-center justify-center text-zinc-400 italic py-6">
            Game moves will appear here...
          </div>
        ) : (
          turns.map((turn, idx) => {
            const isWhiteActive = currentMoveIndex === turn.whiteIdx;
            const isBlackActive = currentMoveIndex === turn.blackIdx;
            const isEvenRow = idx % 2 === 0;

            return (
              <div
                key={turn.turnNum}
                className={`grid grid-cols-12 items-center py-0.5 px-1.5 rounded transition-colors ${
                  isEvenRow ? 'bg-[#262421]/60' : 'bg-[#211f1c]/80'
                }`}
              >
                {/* Turn Number */}
                <span className="col-span-2 text-zinc-400 text-right pr-2 text-[11px]">
                  {turn.turnNum}.
                </span>

                {/* White Move */}
                <button
                  onClick={() => onSelectMove?.(turn.whiteIdx)}
                  className={`col-span-5 text-left font-semibold px-2 py-0.5 rounded text-xs transition-colors ${
                    isWhiteActive
                      ? 'bg-[#81b64c]/25 text-[#81b64c] border border-[#81b64c]/60'
                      : 'text-zinc-200 hover:bg-[#3c3934]'
                  }`}
                >
                  {turn.white?.san}
                </button>

                {/* Black Move */}
                <button
                  onClick={() => turn.blackIdx !== undefined && onSelectMove?.(turn.blackIdx)}
                  disabled={!turn.black}
                  className={`col-span-5 text-left font-semibold px-2 py-0.5 rounded text-xs transition-colors ${
                    isBlackActive
                      ? 'bg-[#81b64c]/25 text-[#81b64c] border border-[#81b64c]/60'
                      : 'text-zinc-200 hover:bg-[#3c3934]'
                  }`}
                >
                  {turn.black ? turn.black.san : ''}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

