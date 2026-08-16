'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chess } from 'chess.js';
import { BookOpen, ChevronRight, Play, ArrowLeft, ArrowRight, RotateCcw, Bot } from 'lucide-react';
import { ChessBoard } from '@/components/ChessBoard';
import { DEFAULT_BOARD_THEME } from '@/lib/chess/themes';
import { FAMOUS_OPENINGS } from '@/lib/chess/openings';

interface LearnOpeningsPageProps {
  navigate?: (path: string) => void;
}

export const LearnOpeningsPage: React.FC<LearnOpeningsPageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const [selectedOpening, setSelectedOpening] = useState(FAMOUS_OPENINGS[0]);
  const [currentMoveStep, setCurrentMoveStep] = useState(selectedOpening.moves.length);

  // Build dynamic chess position based on move step
  const getOpeningBoard = (moves: string[], step: number) => {
    const c = new Chess();
    for (let i = 0; i < step && i < moves.length; i++) {
      try {
        c.move(moves[i]);
      } catch (e) {
        break;
      }
    }
    return c;
  };

  const activeChess = getOpeningBoard(selectedOpening.moves, currentMoveStep);

  const handleSelectOpening = (op: typeof FAMOUS_OPENINGS[0]) => {
    setSelectedOpening(op);
    setCurrentMoveStep(op.moves.length);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-6 space-y-6">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#81b64c]/40 bg-[#81b64c]/10 px-3 py-1 text-xs font-bold text-[#81b64c] mb-2.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Interactive Chess Theory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          Chess Openings Explorer
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Explore foundational opening repertoires. Step move-by-move through key theoretical variations and understand core plans.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Opening Directory List */}
        <div className="lg:col-span-4 flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
          {FAMOUS_OPENINGS.map((op) => {
            const isSelected = selectedOpening.name === op.name;
            return (
              <button
                key={op.name}
                onClick={() => handleSelectOpening(op)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-[#81b64c]/20 border-[#81b64c] text-[#81b64c]'
                    : 'bg-[#262421] border-[#3c3934] text-zinc-300 hover:bg-[#3c3934]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold font-mono-chess text-[#81b64c]">
                    ECO {op.eco}
                  </span>
                  <span className="text-[10px] text-zinc-400">{op.moves.length} moves</span>
                </div>
                <h3 className="text-xs font-bold text-zinc-100 mb-0.5">{op.name}</h3>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {op.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Center/Right: Interactive Board & Move Stepper */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[520px] flex flex-col gap-3">
            
            {/* Opening Title Bar */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#262421] border border-[#3c3934]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#81b64c] block">
                  ECO {selectedOpening.eco}
                </span>
                <h3 className="text-sm font-extrabold text-zinc-100">{selectedOpening.name}</h3>
              </div>
              <button
                onClick={() => navigate('/play/ai')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-zinc-950 bg-[#81b64c] hover:bg-[#70a33e] rounded transition-colors"
              >
                <Bot className="h-3.5 w-3.5" />
                <span>Play from here</span>
              </button>
            </div>

            {/* Chessboard */}
            <ChessBoard
              chess={activeChess}
              boardTheme={DEFAULT_BOARD_THEME}
              orientation="w"
              isInteractive={false}
              onMove={() => {}}
            />

            {/* Step Controls */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#262421] border border-[#3c3934]">
              <button
                onClick={() => setCurrentMoveStep(0)}
                disabled={currentMoveStep === 0}
                className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Reset to Starting Position"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setCurrentMoveStep((s) => Math.max(0, s - 1))}
                disabled={currentMoveStep === 0}
                className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Step Backward"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {/* Move Notation Ribbon */}
              <div className="flex items-center gap-1 overflow-x-auto px-2 py-0.5 font-mono-chess text-xs text-zinc-300">
                {selectedOpening.moves.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentMoveStep(idx + 1)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      idx + 1 === currentMoveStep
                        ? 'bg-[#81b64c] text-zinc-950 font-bold'
                        : 'bg-[#161512] text-zinc-300 border border-[#3c3934] hover:bg-[#3c3934]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentMoveStep((s) => Math.min(selectedOpening.moves.length, s + 1))}
                disabled={currentMoveStep === selectedOpening.moves.length}
                className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Step Forward"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Deep Strategy Notes */}
            <div className="p-3.5 rounded-lg bg-[#262421] border border-[#3c3934] text-xs text-zinc-300 leading-relaxed">
              <h4 className="font-bold text-[#81b64c] mb-1 text-xs">Strategic Objective</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{selectedOpening.description}</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
