'use client';

import React, { useState } from 'react';
import { RotateCw, Flag, Handshake, RefreshCw, PlusCircle, Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/audio';

interface GameControlsProps {
  onResign?: () => void;
  onOfferDraw?: () => void;
  onFlipBoard: () => void;
  onNewGame?: () => void;
  onRematch?: () => void;
  isGameOver?: boolean;
  canResign?: boolean;
  canOfferDraw?: boolean;
  drawOfferedByMe?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onResign,
  onOfferDraw,
  onFlipBoard,
  onNewGame,
  onRematch,
  isGameOver = false,
  canResign = true,
  canOfferDraw = true,
  drawOfferedByMe = false,
}) => {
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  const handleResignClick = () => {
    if (showResignConfirm) {
      setShowResignConfirm(false);
      onResign?.();
    } else {
      setShowResignConfirm(true);
      setTimeout(() => setShowResignConfirm(false), 5000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-[#262421] border border-[#3c3934]">
      {/* Flip Board */}
      <button
        onClick={onFlipBoard}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 bg-[#3c3934] hover:bg-[#4a4641] hover:text-white rounded border border-[#3c3934] transition-colors"
        title="Flip Board Orientation"
      >
        <RotateCw className="h-3.5 w-3.5" />
        <span>Flip</span>
      </button>

      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 bg-[#3c3934] hover:bg-[#4a4641] hover:text-white rounded border border-[#3c3934] transition-colors"
        title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#81b64c]" /> : <VolumeX className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{soundEnabled ? 'Sound' : 'Muted'}</span>
      </button>

      {/* Draw Offer */}
      {!isGameOver && onOfferDraw && (
        <button
          onClick={onOfferDraw}
          disabled={!canOfferDraw || drawOfferedByMe}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded border transition-colors ${
            drawOfferedByMe
              ? 'bg-[#81b64c]/20 text-[#81b64c] border-[#81b64c]/40 cursor-default'
              : 'text-zinc-200 bg-[#3c3934] hover:bg-[#4a4641] hover:text-white border-[#3c3934] disabled:opacity-40'
          }`}
          title="Offer Draw to Opponent"
        >
          <Handshake className="h-3.5 w-3.5" />
          <span>{drawOfferedByMe ? 'Draw Offered' : 'Draw'}</span>
        </button>
      )}

      {/* Resign with Confirmation */}
      {!isGameOver && onResign && (
        <button
          onClick={handleResignClick}
          disabled={!canResign}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded border transition-colors ${
            showResignConfirm
              ? 'bg-[#b33430] text-white border-red-500 animate-pulse'
              : 'text-red-400 bg-red-950/30 hover:bg-red-900/40 border-red-900/40 disabled:opacity-40'
          }`}
          title="Resign Game"
        >
          <Flag className="h-3.5 w-3.5" />
          <span>{showResignConfirm ? 'Confirm?' : 'Resign'}</span>
        </button>
      )}

      {/* Rematch */}
      {isGameOver && onRematch && (
        <button
          onClick={onRematch}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-950 bg-[#81b64c] hover:bg-[#70a33e] rounded shadow-sm transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Rematch</span>
        </button>
      )}

      {/* New Game */}
      {onNewGame && (
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 bg-[#3c3934] hover:bg-[#4a4641] hover:text-white rounded border border-[#3c3934] transition-colors ml-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>New Game</span>
        </button>
      )}
    </div>
  );
};

