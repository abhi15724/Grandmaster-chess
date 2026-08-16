'use client';

import React from 'react';
import { PieceType, PieceColor } from '@/types/chess';
import { ChessPieceIcon } from '@/lib/chess/pieces';
import { PIECE_VALUES } from '@/lib/chess/evaluator';

interface CapturedPiecesProps {
  whiteCaptured: PieceType[]; // pieces white captured (i.e. black pieces)
  blackCaptured: PieceType[]; // pieces black captured (i.e. white pieces)
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  whiteCaptured,
  blackCaptured,
}) => {
  // Calculate material sum
  const whiteScore = whiteCaptured.reduce((acc, p) => acc + (PIECE_VALUES[p] || 0), 0);
  const blackScore = blackCaptured.reduce((acc, p) => acc + (PIECE_VALUES[p] || 0), 0);

  const whiteAdvantage = Math.floor((whiteScore - blackScore) / 100);
  const blackAdvantage = Math.floor((blackScore - whiteScore) / 100);

  return (
    <div className="flex flex-col gap-1.5 py-1">
      {/* Black's captured pieces (pieces taken by white) */}
      <div className="flex items-center gap-1 min-h-[22px]">
        <div className="flex flex-wrap items-center gap-0.5">
          {whiteCaptured.map((p, idx) => (
            <div key={idx} className="w-4 h-4 opacity-80">
              <ChessPieceIcon type={p} color="b" />
            </div>
          ))}
        </div>
        {whiteAdvantage > 0 && (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60 ml-1">
            +{whiteAdvantage}
          </span>
        )}
      </div>

      {/* White's captured pieces (pieces taken by black) */}
      <div className="flex items-center gap-1 min-h-[22px]">
        <div className="flex flex-wrap items-center gap-0.5">
          {blackCaptured.map((p, idx) => (
            <div key={idx} className="w-4 h-4 opacity-80">
              <ChessPieceIcon type={p} color="w" />
            </div>
          ))}
        </div>
        {blackAdvantage > 0 && (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60 ml-1">
            +{blackAdvantage}
          </span>
        )}
      </div>
    </div>
  );
};
