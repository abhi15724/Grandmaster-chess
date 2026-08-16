'use client';

import React from 'react';
import { PieceType, PieceColor } from '@/types/chess';
import { ChessPieceIcon } from '@/lib/chess/pieces';

interface PromotionModalProps {
  color: PieceColor;
  onSelect: (piece: PieceType) => void;
  onCancel?: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  onSelect,
}) => {
  const pieces: { type: PieceType; label: string }[] = [
    { type: 'q', label: 'Queen' },
    { type: 'n', label: 'Knight' },
    { type: 'r', label: 'Rook' },
    { type: 'b', label: 'Bishop' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-xl border border-[#3c3934] bg-[#262421] p-5 shadow-2xl text-center">
        <h3 className="text-base font-bold text-zinc-100 mb-1">Pawn Promotion</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Select a piece to promote your pawn:
        </p>

        <div className="grid grid-cols-4 gap-2.5">
          {pieces.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-[#3c3934] bg-[#161512] hover:bg-[#81b64c]/20 hover:border-[#81b64c]/60 active:scale-95 transition-all group"
            >
              <div className="w-10 h-10 mb-1 transition-transform group-hover:scale-105">
                <ChessPieceIcon type={type} color={color} />
              </div>
              <span className="text-xs font-semibold text-zinc-300 group-hover:text-[#81b64c]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

