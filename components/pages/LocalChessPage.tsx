'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chess, Square } from 'chess.js';
import { Monitor, RotateCw, RefreshCw, ChevronLeft, ToggleLeft, ToggleRight, Volume2 } from 'lucide-react';
import { ChessBoard } from '@/components/ChessBoard';
import { ChessClock } from '@/components/ChessClock';
import { MoveHistory } from '@/components/MoveHistory';
import { CapturedPieces } from '@/components/CapturedPieces';
import { GameControls } from '@/components/GameControls';
import { PromotionModal } from '@/components/PromotionModal';
import { GameEndModal } from '@/components/GameEndModal';
import { ThemeSelector } from '@/components/ThemeSelector';
import { SoundSettingsModal } from '@/components/SoundSettingsModal';
import { PieceColor, PieceType, MoveRecord, BoardTheme, TimeControlPreset } from '@/types/chess';
import { DEFAULT_BOARD_THEME } from '@/lib/chess/themes';
import { TIME_CONTROLS } from '@/lib/constants';
import { sound } from '@/lib/audio';
import { recordGameResult } from '@/lib/storage';

interface LocalChessPageProps {
  navigate?: (path: string) => void;
}

export const LocalChessPage: React.FC<LocalChessPageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const [chess] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(DEFAULT_BOARD_THEME);
  const [autoFlip, setAutoFlip] = useState(true);
  const [orientation, setOrientation] = useState<PieceColor>('w');
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  const [whiteCaptured, setWhiteCaptured] = useState<PieceType[]>([]);
  const [blackCaptured, setBlackCaptured] = useState<PieceType[]>([]);

  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  const [gameEndReason, setGameEndReason] = useState<string>('');

  const handleMove = (from: Square, to: Square, promotion: PieceType = 'q') => {
    if (isGameOver) return;
    try {
      const move = chess.move({ from, to, promotion });
      if (!move) return;

      if (move.promotion) sound.playPromotion();
      else if (move.captured) sound.playCapture();
      else if (move.flags.includes('k') || move.flags.includes('q')) sound.playCastle();
      else sound.playMove();

      if (chess.inCheck()) {
        setTimeout(() => sound.playCheck(), 75);
      }

      if (move.captured) {
        if (move.color === 'w') setWhiteCaptured((p) => [...p, move.captured as PieceType]);
        else setBlackCaptured((p) => [...p, move.captured as PieceType]);
      }

      const newRecord: MoveRecord = {
        san: move.san,
        from: move.from as Square,
        to: move.to as Square,
        piece: move.piece as PieceType,
        color: move.color as PieceColor,
        captured: move.captured as PieceType | undefined,
        promotion: move.promotion as PieceType | undefined,
        fenBefore: fen,
        fenAfter: chess.fen(),
      };

      setMoves((p) => [...p, newRecord]);
      setLastMove({ from: move.from, to: move.to });
      setFen(chess.fen());

      if (autoFlip) {
        setOrientation(chess.turn());
      }

      checkGameStatus();
    } catch (err) {
      console.warn('Illegal move:', err);
    }
  };

  const checkGameStatus = () => {
    if (chess.isCheckmate()) {
      const winColor = chess.turn() === 'w' ? 'b' : 'w';
      handleGameOver(winColor, 'Checkmate');
    } else if (chess.isStalemate()) {
      handleGameOver('draw', 'Stalemate');
    } else if (chess.isThreefoldRepetition()) {
      handleGameOver('draw', 'Threefold repetition');
    } else if (chess.isInsufficientMaterial()) {
      handleGameOver('draw', 'Insufficient material');
    } else if (chess.isDraw()) {
      handleGameOver('draw', 'Draw agreed / 50-move rule');
    }
  };

  const handleGameOver = (winColor: 'w' | 'b' | 'draw', reason: string) => {
    setIsGameOver(true);
    setWinner(winColor);
    setGameEndReason(reason);

    sound.playGameEnd(winColor !== 'draw');

    recordGameResult(
      winColor === 'draw' ? 'draw' : 'win',
      'Local Player',
      1200,
      'local',
      'w',
      reason,
      moves.length,
      chess.pgn(),
      chess.fen()
    );
  };

  const handleReset = () => {
    chess.reset();
    setFen(chess.fen());
    setMoves([]);
    setLastMove(null);
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setIsGameOver(false);
    setWinner(null);
    setGameEndReason('');
    setOrientation('w');
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 lg:px-6">
      
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3c3934] mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Lobby</span>
          </button>
          <span className="text-zinc-600">/</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#81b64c]">
            <Monitor className="h-4 w-4" />
            <span>Local Pass & Play</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound FX Settings */}
          <button
            id="local-sound-settings-btn"
            onClick={() => setIsSoundModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#3c3934] bg-[#262421] text-zinc-300 hover:text-white hover:border-[#81b64c]/60 transition-colors"
            title="Audio FX Settings"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#81b64c]" />
            <span className="hidden sm:inline">Audio FX</span>
          </button>

          {/* Auto-flip switch */}
          <button
            onClick={() => setAutoFlip(!autoFlip)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#3c3934] bg-[#262421] text-zinc-300 hover:border-zinc-500"
            title="Automatically flip board after each move"
          >
            {autoFlip ? <ToggleRight className="h-4 w-4 text-[#81b64c]" /> : <ToggleLeft className="h-4 w-4 text-zinc-500" />}
            <span className="hidden sm:inline">Auto-flip: <strong>{autoFlip ? 'On' : 'Off'}</strong></span>
          </button>

          <ThemeSelector currentTheme={boardTheme} onSelectTheme={setBoardTheme} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT: Chessboard */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[560px] flex flex-col gap-2.5">
            
            {/* Top Player Indicator */}
            <div className="flex items-center justify-between">
              <ChessClock
                timeInSeconds={0}
                isActive={!isGameOver && chess.turn() === (orientation === 'w' ? 'b' : 'w')}
                playerName={orientation === 'w' ? 'Player 2 (Black)' : 'Player 1 (White)'}
                playerColor={orientation === 'w' ? 'b' : 'w'}
                isUntimed={true}
              />
              <CapturedPieces
                whiteCaptured={orientation === 'w' ? blackCaptured : whiteCaptured}
                blackCaptured={[]}
              />
            </div>

            {/* Chessboard */}
            <ChessBoard
              chess={chess}
              boardTheme={boardTheme}
              orientation={orientation}
              isInteractive={!isGameOver}
              onMove={(from, to, promo) => handleMove(from, to, promo || 'q')}
              lastMove={lastMove}
              onPromotionRequired={(from, to) => setPendingPromotion({ from, to })}
            />

            {/* Bottom Player Indicator */}
            <div className="flex items-center justify-between">
              <ChessClock
                timeInSeconds={0}
                isActive={!isGameOver && chess.turn() === orientation}
                playerName={orientation === 'w' ? 'Player 1 (White)' : 'Player 2 (Black)'}
                playerColor={orientation}
                isUntimed={true}
              />
              <CapturedPieces
                whiteCaptured={orientation === 'w' ? whiteCaptured : blackCaptured}
                blackCaptured={[]}
              />
            </div>

            {/* Game Controls */}
            <GameControls
              onFlipBoard={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
              onNewGame={handleReset}
              isGameOver={isGameOver}
            />
          </div>
        </div>

        {/* RIGHT: Move History */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <MoveHistory
            moves={moves}
            pgn={chess.pgn()}
          />

          <div className="p-3 rounded-lg border border-[#3c3934] bg-[#262421] text-xs">
            <h4 className="font-bold text-zinc-200 mb-1">Pass & Play Mode</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Two players can share the same screen. The board can automatically rotate after each move to face the active player, or you can manually toggle the orientation.
            </p>
          </div>
        </div>
      </div>


      {/* Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={chess.turn()}
          onSelect={(piece) => {
            handleMove(pendingPromotion.from, pendingPromotion.to, piece);
            setPendingPromotion(null);
          }}
          onCancel={() => setPendingPromotion(null)}
        />
      )}

      {/* Game End Modal */}
      {isGameOver && (
        <GameEndModal
          winner={winner}
          reason={gameEndReason}
          movesCount={moves.length}
          pgn={chess.pgn()}
          onNewGame={handleReset}
          onClose={() => setIsGameOver(false)}
        />
      )}

      {/* Sound Settings Modal */}
      <SoundSettingsModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      />
    </div>
  );
};
