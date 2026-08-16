'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { Bot, RotateCw, RefreshCw, Zap, Shield, Swords, Sparkles, ChevronLeft } from 'lucide-react';
import { ChessBoard } from '@/components/ChessBoard';
import { ChessClock } from '@/components/ChessClock';
import { MoveHistory } from '@/components/MoveHistory';
import { CapturedPieces } from '@/components/CapturedPieces';
import { GameControls } from '@/components/GameControls';
import { EvaluationBar } from '@/components/EvaluationBar';
import { PromotionModal } from '@/components/PromotionModal';
import { GameEndModal } from '@/components/GameEndModal';
import { ThemeSelector } from '@/components/ThemeSelector';
import { SoundSettingsModal } from '@/components/SoundSettingsModal';
import { PieceColor, PieceType, AIDifficulty, TimeControlPreset, MoveRecord, BoardTheme } from '@/types/chess';
import { DEFAULT_BOARD_THEME } from '@/lib/chess/themes';
import { TIME_CONTROLS } from '@/lib/constants';
import { getEngine } from '@/lib/chess/engine';
import { evaluateBoard } from '@/lib/chess/evaluator';
import { sound } from '@/lib/audio';
import { recordGameResult, getStoredUserStats } from '@/lib/storage';
import { Volume2 } from 'lucide-react';

interface PlayAIPageProps {
  initialDifficulty?: AIDifficulty;
  navigate?: (path: string) => void;
}

export const PlayAIPage: React.FC<PlayAIPageProps> = ({
  initialDifficulty = 'intermediate',
}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  // Game Setup State
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [timePreset, setTimePreset] = useState<TimeControlPreset>('10+0');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(DEFAULT_BOARD_THEME);
  const [boardOrientation, setBoardOrientation] = useState<PieceColor>('w');
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  // Active Game State
  const [chess] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [evalScore, setEvalScore] = useState<number>(0);

  // Captured pieces
  const [whiteCaptured, setWhiteCaptured] = useState<PieceType[]>([]);
  const [blackCaptured, setBlackCaptured] = useState<PieceType[]>([]);

  // Timers
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);

  // Promotion modal
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Game over state
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  const [gameEndReason, setGameEndReason] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start new game
  const handleStartGame = () => {
    chess.reset();
    setFen(chess.fen());
    setMoves([]);
    setLastMove(null);
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setIsGameOver(false);
    setWinner(null);
    setGameEndReason('');
    setEvalScore(0);

    const tc = TIME_CONTROLS[timePreset];
    setWhiteTime(tc.initialSeconds);
    setBlackTime(tc.initialSeconds);

    let chosenColor: PieceColor = playerColor;
    if (playerColor === ('random' as any)) {
      chosenColor = Math.random() < 0.5 ? 'w' : 'b';
    }
    setBoardOrientation(chosenColor);
    setIsPlaying(true);

    // If AI is White, trigger initial AI move
    if (chosenColor === 'b') {
      triggerAiMove();
    }
  };

  // Clock countdown loop
  useEffect(() => {
    if (!isPlaying || isGameOver || timePreset === 'none') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const currentTurn = chess.turn();
      if (currentTurn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            handleGameOver('b', 'Black won on time');
            return 0;
          }
          if (prev <= 10) sound.playClockTick();
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            handleGameOver('w', 'White won on time');
            return 0;
          }
          if (prev <= 10) sound.playClockTick();
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isGameOver, chess.fen(), timePreset]);

  // Handle player moving
  const handlePlayerMove = (from: Square, to: Square, promotion: PieceType = 'q') => {
    if (isGameOver || isAiThinking) return;

    try {
      const move = chess.move({ from, to, promotion });
      if (!move) return;

      // Play sound
      if (move.promotion) sound.playPromotion();
      else if (move.captured) sound.playCapture();
      else if (move.flags.includes('k') || move.flags.includes('q')) sound.playCastle();
      else sound.playMove();

      if (chess.inCheck()) {
        setTimeout(() => sound.playCheck(), 75);
      }

      // Track captured pieces
      if (move.captured) {
        if (move.color === 'w') {
          setWhiteCaptured((prev) => [...prev, move.captured as PieceType]);
        } else {
          setBlackCaptured((prev) => [...prev, move.captured as PieceType]);
        }
      }

      // Add increment
      const tc = TIME_CONTROLS[timePreset];
      if (move.color === 'w') {
        setWhiteTime((t) => t + tc.incrementSeconds);
      } else {
        setBlackTime((t) => t + tc.incrementSeconds);
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

      setMoves((prev) => [...prev, newRecord]);
      setLastMove({ from: move.from, to: move.to });
      setFen(chess.fen());

      const score = evaluateBoard(chess);
      setEvalScore(score);

      // Check game termination
      if (checkGameStatus()) return;

      // Trigger AI reply
      triggerAiMove();
    } catch (err) {
      console.warn('Move failed:', err);
    }
  };

  // Trigger AI move calculation
  const triggerAiMove = async () => {
    if (chess.isGameOver() || isGameOver) return;
    setIsAiThinking(true);

    try {
      const engine = getEngine(difficulty);
      // Small artificial delay for realistic calculation feel
      const minDelay = difficulty === 'basic' ? 300 : difficulty === 'intermediate' ? 600 : 900;
      const [aiResult] = await Promise.all([
        engine.findBestMove(chess.fen(), chess.turn() as PieceColor),
        new Promise((resolve) => setTimeout(resolve, minDelay)),
      ]);

      if (aiResult) {
        const move = chess.move({
          from: aiResult.from,
          to: aiResult.to,
          promotion: (aiResult.promotion as PieceSymbol) || 'q',
        });

        if (move) {
          if (move.promotion) sound.playPromotion();
          else if (move.captured) sound.playCapture();
          else if (move.flags.includes('k') || move.flags.includes('q')) sound.playCastle();
          else sound.playMove();

          if (chess.inCheck()) {
            setTimeout(() => sound.playCheck(), 75);
          }

          if (move.captured) {
            if (move.color === 'w') {
              setWhiteCaptured((prev) => [...prev, move.captured as PieceType]);
            } else {
              setBlackCaptured((prev) => [...prev, move.captured as PieceType]);
            }
          }

          const tc = TIME_CONTROLS[timePreset];
          if (move.color === 'w') {
            setWhiteTime((t) => t + tc.incrementSeconds);
          } else {
            setBlackTime((t) => t + tc.incrementSeconds);
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

          setMoves((prev) => [...prev, newRecord]);
          setLastMove({ from: move.from, to: move.to });
          setFen(chess.fen());
          setEvalScore(aiResult.evalScore || evaluateBoard(chess));

          checkGameStatus();
        }
      }
    } catch (err) {
      console.error('AI calculation error:', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  const checkGameStatus = (): boolean => {
    if (chess.isCheckmate()) {
      const winnerColor = chess.turn() === 'w' ? 'b' : 'w';
      handleGameOver(winnerColor, 'Checkmate');
      return true;
    }
    if (chess.isStalemate()) {
      handleGameOver('draw', 'Stalemate');
      return true;
    }
    if (chess.isThreefoldRepetition()) {
      handleGameOver('draw', 'Threefold repetition');
      return true;
    }
    if (chess.isInsufficientMaterial()) {
      handleGameOver('draw', 'Insufficient material');
      return true;
    }
    if (chess.isDraw()) {
      handleGameOver('draw', 'Draw agreed / 50-move rule');
      return true;
    }
    return false;
  };

  const handleGameOver = (winColor: 'w' | 'b' | 'draw', reason: string) => {
    setIsGameOver(true);
    setWinner(winColor);
    setGameEndReason(reason);

    const opponentRating = difficulty === 'basic' ? 800 : difficulty === 'intermediate' ? 1400 : 2100;
    const isPlayerWin = winColor === boardOrientation;
    const resultType = winColor === 'draw' ? 'draw' : isPlayerWin ? 'win' : 'loss';

    sound.playGameEnd(resultType === 'win');

    recordGameResult(
      resultType,
      `AI (${difficulty.toUpperCase()})`,
      opponentRating,
      'ai',
      boardOrientation,
      reason,
      moves.length,
      chess.pgn(),
      chess.fen()
    );
  };

  const handleResign = () => {
    const aiColor = boardOrientation === 'w' ? 'b' : 'w';
    handleGameOver(aiColor, 'Resigned by player');
  };

  const handleOfferDraw = () => {
    // Basic AI might accept if position is roughly equal
    const score = evaluateBoard(chess);
    if (Math.abs(score) < 150) {
      handleGameOver('draw', 'Draw accepted by AI');
    } else {
      alert('AI declined the draw offer: the position is still actively contested.');
    }
  };

  const opponentName = `AI Bot (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`;
  const myPlayerName = getStoredUserStats().name;

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 lg:px-6">
      
      {/* Top Breadcrumb & Controls */}
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
            <Bot className="h-4 w-4" />
            <span className="capitalize">Play vs AI ({difficulty})</span>
          </div>
        </div>

        {/* Theme & Sound Picker */}
        <div className="flex items-center gap-2">
          <button
            id="play-ai-sound-settings-btn"
            onClick={() => setIsSoundModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#3c3934] bg-[#262421] text-zinc-300 hover:text-white hover:border-[#81b64c]/60 transition-colors"
            title="Audio FX Settings"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#81b64c]" />
            <span>Audio FX</span>
          </button>
          <ThemeSelector currentTheme={boardTheme} onSelectTheme={setBoardTheme} />
        </div>
      </div>

      {/* If Not Playing -> Setup View */}
      {!isPlaying ? (
        <div className="max-w-lg mx-auto rounded-xl border border-[#3c3934] bg-[#262421] p-5 sm:p-6 shadow-xl">
          <div className="text-center mb-5">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#81b64c] text-zinc-950 shadow-md">
              <Bot className="h-6 w-6 text-zinc-950" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mb-1">
              Play Against AI
            </h2>
            <p className="text-xs text-zinc-400">
              Select difficulty level, color, and time control to start.
            </p>
          </div>

          {/* 1. Difficulty Tier */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              1. Choose Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'basic', label: 'Basic', sub: 'Beginner (~800)', icon: Sparkles },
                { id: 'intermediate', label: 'Intermediate', sub: 'Casual (~1400)', icon: Zap },
                { id: 'advanced', label: 'Advanced', sub: 'Master (~2100)', icon: Swords },
              ].map((tier) => {
                const Icon = tier.icon;
                const isSelected = difficulty === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setDifficulty(tier.id as AIDifficulty)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-[#81b64c]/20 border-[#81b64c] text-[#81b64c] font-bold shadow-xs'
                        : 'bg-[#161512] border-[#3c3934] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1 text-[#81b64c]" />
                    <span className="text-xs font-semibold">{tier.label}</span>
                    <span className="text-[10px] text-zinc-400">{tier.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Selection */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              2. Play As
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'w', label: 'White', colorCircle: 'bg-white border-zinc-400' },
                { id: 'random', label: 'Random', colorCircle: 'bg-gradient-to-r from-white to-[#161512] border-zinc-500' },
                { id: 'b', label: 'Black', colorCircle: 'bg-[#161512] border-zinc-700' },
              ].map((c) => {
                const isSelected = playerColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setPlayerColor(c.id as PieceColor)}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#81b64c]/20 border-[#81b64c] text-[#81b64c] font-bold'
                        : 'bg-[#161512] border-[#3c3934] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <div className={`h-3.5 w-3.5 rounded-full border ${c.colorCircle}`} />
                    <span className="text-xs">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Time Control */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              3. Time Control
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(TIME_CONTROLS) as TimeControlPreset[]).map((key) => {
                const tc = TIME_CONTROLS[key];
                const isSelected = timePreset === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTimePreset(key)}
                    className={`p-2 rounded border text-xs font-semibold text-center transition-colors ${
                      isSelected
                        ? 'bg-[#81b64c]/20 border-[#81b64c] text-[#81b64c]'
                        : 'bg-[#161512] border-[#3c3934] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {tc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#81b64c] py-3 text-sm font-bold text-zinc-950 hover:bg-[#70a33e] shadow-md transition-all active:scale-98"
          >
            <Swords className="h-4 w-4" />
            <span>Start Game</span>
          </button>
        </div>
      ) : (
        /* Active Game Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: Chessboard + Clocks + Eval Bar */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row gap-3.5 items-center sm:items-start justify-center">
            
            {/* Realtime Position Evaluation Bar */}
            <div className="hidden sm:block pt-11">
              <EvaluationBar
                evalScoreInCentipawns={evalScore}
                orientation={boardOrientation}
              />
            </div>

            {/* Main Board Container */}
            <div className="w-full max-w-[560px] flex flex-col gap-2.5">
              
              {/* Opponent (Top) Player Bar */}
              <div className="flex items-center justify-between">
                <ChessClock
                  timeInSeconds={boardOrientation === 'w' ? blackTime : whiteTime}
                  isActive={isPlaying && !isGameOver && chess.turn() === (boardOrientation === 'w' ? 'b' : 'w')}
                  playerName={opponentName}
                  playerColor={boardOrientation === 'w' ? 'b' : 'w'}
                  isUntimed={timePreset === 'none'}
                />
                <CapturedPieces
                  whiteCaptured={boardOrientation === 'w' ? blackCaptured : whiteCaptured}
                  blackCaptured={[]}
                />
              </div>

              {/* Chessboard */}
              <ChessBoard
                chess={chess}
                boardTheme={boardTheme}
                orientation={boardOrientation}
                isInteractive={isPlaying && !isGameOver && chess.turn() === boardOrientation && !isAiThinking}
                onMove={(from, to, promo) => handlePlayerMove(from, to, promo || 'q')}
                lastMove={lastMove}
                onPromotionRequired={(from, to) => setPendingPromotion({ from, to })}
                isAiThinking={isAiThinking}
              />

              {/* Player (Bottom) Player Bar */}
              <div className="flex items-center justify-between">
                <ChessClock
                  timeInSeconds={boardOrientation === 'w' ? whiteTime : blackTime}
                  isActive={isPlaying && !isGameOver && chess.turn() === boardOrientation}
                  playerName={myPlayerName}
                  playerColor={boardOrientation}
                  isUntimed={timePreset === 'none'}
                />
                <CapturedPieces
                  whiteCaptured={boardOrientation === 'w' ? whiteCaptured : blackCaptured}
                  blackCaptured={[]}
                />
              </div>

              {/* Game Controls Strip */}
              <GameControls
                onResign={handleResign}
                onOfferDraw={handleOfferDraw}
                onFlipBoard={() => setBoardOrientation((o) => (o === 'w' ? 'b' : 'w'))}
                onNewGame={() => setIsPlaying(false)}
                onRematch={handleStartGame}
                isGameOver={isGameOver}
              />
            </div>
          </div>

          {/* RIGHT: Move Notation History & Controls */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <MoveHistory
              moves={moves}
              pgn={chess.pgn()}
            />

            {/* Game Mode Info Card */}
            <div className="p-3.5 rounded-lg border border-[#3c3934] bg-[#262421] text-xs shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">Match Details</span>
                <span className="font-mono-chess font-bold text-[#81b64c] uppercase text-xs">
                  {difficulty} AI
                </span>
              </div>
              <div className="space-y-1 text-zinc-400 text-xs">
                <div className="flex justify-between py-0.5 border-b border-[#3c3934]/60">
                  <span>Time Control:</span>
                  <span className="text-zinc-200 font-medium">{TIME_CONTROLS[timePreset].label}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#3c3934]/60">
                  <span>Your Color:</span>
                  <span className="text-zinc-200 font-medium">{boardOrientation === 'w' ? 'White' : 'Black'}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Current Turn:</span>
                  <span className="text-[#81b64c] font-bold">
                    {chess.turn() === 'w' ? 'White to move' : 'Black to move'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={boardOrientation}
          onSelect={(piece) => {
            handlePlayerMove(pendingPromotion.from, pendingPromotion.to, piece);
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
          myColor={boardOrientation}
          movesCount={moves.length}
          pgn={chess.pgn()}
          onRematch={handleStartGame}
          onNewGame={() => setIsPlaying(false)}
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
