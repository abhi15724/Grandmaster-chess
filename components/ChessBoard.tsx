'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { PieceColor, PieceType, BoardTheme } from '@/types/chess';
import { ChessPieceIcon } from '@/lib/chess/pieces';
import { sound } from '@/lib/audio';

interface ChessBoardProps {
  chess: Chess;
  boardTheme: BoardTheme;
  orientation?: PieceColor; // 'w' or 'b'
  isInteractive?: boolean;
  onMove: (from: Square, to: Square, promotion?: PieceType) => void;
  lastMove?: { from: string; to: string } | null;
  onPromotionRequired?: (from: Square, to: Square) => void;
  isAiThinking?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  boardTheme,
  orientation = 'w',
  isInteractive = true,
  onMove,
  lastMove,
  onPromotionRequired,
  isAiThinking = false,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  // Determine ranks & files based on orientation
  const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = orientation === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  // Check state
  const inCheck = chess.inCheck();
  let kingInCheckSquare: Square | null = null;
  if (inCheck) {
    const turnColor = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turnColor) {
          const file = String.fromCharCode('a'.charCodeAt(0) + c);
          const rank = 8 - r;
          kingInCheckSquare = `${file}${rank}` as Square;
          break;
        }
      }
    }
  }

  // Clear selection if chess changes
  useEffect(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [chess.fen()]);

  const handleSquareClick = (square: Square) => {
    if (!isInteractive || isAiThinking) return;

    // If square is already selected, unselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // If we have a selected square and clicked on a legal move destination
    if (selectedSquare) {
      const matchedMove = legalMoves.find((m) => m.to === square);
      if (matchedMove) {
        // Check for pawn promotion
        const piece = chess.get(selectedSquare);
        const isPromotion =
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && square.endsWith('8')) || (piece.color === 'b' && square.endsWith('1')));

        if (isPromotion && onPromotionRequired) {
          onPromotionRequired(selectedSquare, square);
        } else {
          onMove(selectedSquare, square, 'q');
        }
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      } else {
        // Clicked invalid target for the selected piece
        const targetPiece = chess.get(square);
        if (!targetPiece || targetPiece.color !== chess.turn()) {
          sound.playIllegal();
        }
      }
    }

    // Otherwise select piece on current square if it's the current player's piece
    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalMoves(moves);
    } else {
      if (selectedSquare) sound.playIllegal();
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (!isInteractive || isAiThinking) {
      e.preventDefault();
      return;
    }
    const piece = chess.get(square);
    if (!piece || piece.color !== chess.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    setSelectedSquare(square);
    const moves = chess.moves({ square, verbose: true });
    setLegalMoves(moves);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    const sourceSquare = draggedSquare || (e.dataTransfer.getData('text/plain') as Square);
    if (!sourceSquare) return;

    const matchedMove = legalMoves.find((m) => m.to === targetSquare);
    if (matchedMove) {
      const piece = chess.get(sourceSquare);
      const isPromotion =
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && targetSquare.endsWith('8')) || (piece.color === 'b' && targetSquare.endsWith('1')));

      if (isPromotion && onPromotionRequired) {
        onPromotionRequired(sourceSquare, targetSquare);
      } else {
        onMove(sourceSquare, targetSquare, 'q');
      }
    } else if (sourceSquare !== targetSquare) {
      sound.playIllegal();
    }

    setDraggedSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <div
      ref={boardRef}
      className={`relative w-full aspect-square max-w-[560px] mx-auto rounded-xl border-4 overflow-hidden shadow-2xl chess-board-container ${boardTheme.borderClass}`}
      style={{ touchAction: 'none' }}
    >
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, rankIdx) =>
          files.map((file, fileIdx) => {
            const square = `${file}${rank}` as Square;
            const piece = chess.get(square);

            const isLight = (file.charCodeAt(0) - 'a'.charCodeAt(0) + rank) % 2 !== 0;
            const isSelected = selectedSquare === square;
            const isLegalTarget = legalMoves.some((m) => m.to === square);
            const isCaptureTarget = isLegalTarget && piece !== null;
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isKingInCheck = inCheck && kingInCheckSquare === square;

            // Compute background color
            let bg = isLight ? boardTheme.lightSquare : boardTheme.darkSquare;

            return (
              <div
                key={square}
                id={`square-${square}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                className="relative flex items-center justify-center cursor-pointer transition-colors duration-150"
                style={{ backgroundColor: bg }}
              >
                {/* Last move highlight */}
                {(isLastMoveFrom || isLastMoveTo) && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity"
                    style={{ backgroundColor: boardTheme.highlightLastMove }}
                  />
                )}

                {/* Selected Square Highlight */}
                {isSelected && (
                  <div
                    className="absolute inset-0 pointer-events-none ring-2 ring-inset ring-amber-400"
                    style={{ backgroundColor: boardTheme.highlightSelected }}
                  />
                )}

                {/* King Check Red Glow */}
                {isKingInCheck && (
                  <div
                    className="absolute inset-0 pointer-events-none animate-pulse ring-4 ring-rose-600"
                    style={{ backgroundColor: boardTheme.highlightCheck }}
                  />
                )}

                {/* Piece Icon */}
                {piece && (
                  <div
                    draggable={isInteractive && piece.color === chess.turn() && !isAiThinking}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className={`relative z-10 w-[82%] h-[82%] flex items-center justify-center transition-transform ${
                      piece.color === chess.turn() && isInteractive && !isAiThinking
                        ? 'hover:scale-108 cursor-grab active:cursor-grabbing'
                        : 'cursor-default'
                    }`}
                  >
                    <ChessPieceIcon type={piece.type} color={piece.color} />
                  </div>
                )}

                {/* Legal Move Indicators */}
                {isLegalTarget && !isCaptureTarget && (
                  <div className="absolute z-20 w-3.5 h-3.5 rounded-full bg-zinc-900/40 pointer-events-none shadow-sm" />
                )}

                {isCaptureTarget && (
                  <div className="absolute z-20 inset-1 rounded-full border-4 border-zinc-900/35 pointer-events-none" />
                )}

                {/* Coordinate Labels */}
                {/* File letter on bottom rank */}
                {rankIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[10px] font-bold uppercase pointer-events-none leading-none select-none ${
                      isLight ? 'text-zinc-600/70' : 'text-zinc-300/70'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Rank number on left file */}
                {fileIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[10px] font-bold pointer-events-none leading-none select-none ${
                      isLight ? 'text-zinc-600/70' : 'text-zinc-300/70'
                    }`}
                  >
                    {rank}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI Thinking Overlay Banner */}
      {isAiThinking && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-zinc-950/90 border border-amber-500/40 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-xl backdrop-blur-md animate-pulse">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>AI is calculating...</span>
        </div>
      )}

      {/* Check Alert Banner */}
      {inCheck && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full bg-rose-950/90 border border-rose-500/60 px-3 py-1 text-[11px] font-extrabold text-rose-200 shadow-2xl backdrop-blur-md animate-bounce">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span>CHECK ALERT</span>
        </div>
      )}
    </div>
  );
};
