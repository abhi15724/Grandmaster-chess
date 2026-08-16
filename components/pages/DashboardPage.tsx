'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chess } from 'chess.js';
import { Trophy, User, Calendar, Award, Check, Download, Copy, Play, ArrowLeft, ArrowRight, X, Swords, RefreshCw } from 'lucide-react';
import { ChessBoard } from '@/components/ChessBoard';
import { DEFAULT_BOARD_THEME } from '@/lib/chess/themes';
import { getStoredUserStats, updateUserName, downloadPgnFile, resetUserStats } from '@/lib/storage';
import { SavedGameSummary, UserStats } from '@/types/chess';

interface DashboardPageProps {
  navigate?: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const [stats, setStats] = useState<UserStats>(getStoredUserStats());
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(stats.name);
  const [replayGame, setReplayGame] = useState<SavedGameSummary | null>(null);
  const [replayStep, setReplayStep] = useState(0);

  useEffect(() => {
    setStats(getStoredUserStats());
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      const updated = updateUserName(nameInput.trim());
      setStats(updated);
      setEditingName(false);
    }
  };

  const getRankTier = (elo: number) => {
    if (elo >= 2400) return { title: 'Grandmaster', color: 'text-[#81b64c] border-[#81b64c]/50 bg-[#81b64c]/10' };
    if (elo >= 2200) return { title: 'International Master', color: 'text-[#81b64c] border-[#81b64c]/40 bg-[#81b64c]/10' };
    if (elo >= 2000) return { title: 'Candidate Master', color: 'text-sky-400 border-sky-500/40 bg-sky-500/10' };
    if (elo >= 1600) return { title: 'Club Player', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    if (elo >= 1200) return { title: 'Intermediate', color: 'text-zinc-300 border-[#3c3934] bg-[#262421]' };
    return { title: 'Novice', color: 'text-zinc-400 border-[#3c3934] bg-[#161512]' };
  };

  const rank = getRankTier(stats.rating);
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  // Build replay board for modal
  const getReplayChess = (game: SavedGameSummary, step: number) => {
    const c = new Chess();
    if (!game.pgn) return c;
    try {
      c.loadPgn(game.pgn);
      const historyMoves = c.history();
      const replayC = new Chess();
      for (let i = 0; i < step && i < historyMoves.length; i++) {
        replayC.move(historyMoves[i]);
      }
      return replayC;
    } catch (err) {
      return new Chess();
    }
  };

  const activeReplayChess = replayGame ? getReplayChess(replayGame, replayStep) : new Chess();
  const maxReplaySteps = replayGame ? (replayGame.movesCount || 30) : 0;

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5 lg:px-6 space-y-6">
      
      {/* 1. Profile & Rating Card */}
      <div className="rounded-xl border border-[#3c3934] bg-[#262421] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#81b64c] text-zinc-950 font-extrabold text-2xl shadow-md">
              {stats.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={20}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="rounded border border-[#3c3934] bg-[#161512] px-2.5 py-1 text-sm font-bold text-zinc-100 focus:outline-none focus:border-[#81b64c]"
                  />
                  <button
                    onClick={handleSaveName}
                    className="rounded bg-[#81b64c] p-1.5 text-zinc-950 font-bold hover:bg-[#70a33e]"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-zinc-100">{stats.name}</h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-xs text-zinc-400 hover:text-[#81b64c] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${rank.color}`}>
                  {rank.title}
                </span>
                <span className="text-xs text-zinc-400">
                  ID: <span className="font-mono text-zinc-300">{stats.id.slice(0, 8)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Elo Score Badge */}
          <div className="flex items-center gap-3 bg-[#161512] p-3 rounded-lg border border-[#3c3934]">
            <Trophy className="h-6 w-6 text-[#81b64c]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Rating (Elo)
              </span>
              <span className="font-mono-chess text-2xl font-extrabold text-zinc-100">
                {stats.rating}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="p-4 rounded-lg bg-[#262421] border border-[#3c3934]">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-0.5">Total Matches</span>
          <span className="font-mono-chess text-xl font-bold text-zinc-100">{stats.gamesPlayed}</span>
        </div>

        <div className="p-4 rounded-lg bg-[#262421] border border-[#3c3934]">
          <span className="text-[11px] font-semibold text-emerald-400 block mb-0.5">Victories</span>
          <span className="font-mono-chess text-xl font-bold text-emerald-400">{stats.wins}</span>
        </div>

        <div className="p-4 rounded-lg bg-[#262421] border border-[#3c3934]">
          <span className="text-[11px] font-semibold text-rose-400 block mb-0.5">Defeats</span>
          <span className="font-mono-chess text-xl font-bold text-rose-400">{stats.losses}</span>
        </div>

        <div className="p-4 rounded-lg bg-[#262421] border border-[#3c3934]">
          <span className="text-[11px] font-semibold text-[#81b64c] block mb-0.5">Win Rate</span>
          <span className="font-mono-chess text-xl font-bold text-[#81b64c]">{winRate}%</span>
        </div>
      </div>

      {/* 3. Match History Table */}
      <div className="rounded-xl border border-[#3c3934] bg-[#262421] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#3c3934] bg-[#262421]">
          <h2 className="text-sm font-bold text-zinc-100">Match History</h2>
          <span className="text-xs text-zinc-400">{stats.history.length} games recorded</span>
        </div>

        {stats.history.length === 0 ? (
          <div className="p-10 text-center">
            <Swords className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-zinc-300 mb-1">No games played yet</h3>
            <p className="text-[11px] text-zinc-400 mb-3">Start your first game against AI or play locally to build your match history.</p>
            <button
              onClick={() => navigate('/play/ai')}
              className="px-3 py-1.5 text-xs font-bold rounded bg-[#81b64c] text-zinc-950 hover:bg-[#70a33e] transition-colors"
            >
              Play AI Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#3c3934]">
            {stats.history.map((item) => {
              const isWin = item.result === 'win';
              const isLoss = item.result === 'loss';

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-[#3c3934]/30 transition-colors gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        isWin
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : isLoss
                          ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                          : 'bg-[#161512] text-zinc-300 border border-[#3c3934]'
                      }`}
                    >
                      {item.result}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">
                        vs {item.opponentName}
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        {item.reason} • {item.movesCount} moves • {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setReplayGame(item);
                        setReplayStep(item.movesCount || 20);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-[#161512] hover:bg-[#3c3934] text-zinc-200 border border-[#3c3934] transition-colors"
                    >
                      <Play className="h-3 w-3 text-[#81b64c]" />
                      <span>Replay</span>
                    </button>
                    {item.pgn && (
                      <button
                        onClick={() => downloadPgnFile(item.pgn, `match_${item.id}.pgn`)}
                        className="p-1 text-xs rounded bg-[#161512] hover:bg-[#3c3934] text-zinc-300 border border-[#3c3934] transition-colors"
                        title="Download PGN"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REPLAY MODAL */}
      {replayGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-xl border border-[#3c3934] bg-[#262421] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#3c3934] mb-3">
              <div>
                <h3 className="text-xs font-bold text-zinc-100">
                  Replay: vs {replayGame.opponentName}
                </h3>
                <span className="text-[10px] text-zinc-400">{replayGame.reason}</span>
              </div>
              <button
                onClick={() => setReplayGame(null)}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-[#3c3934]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-w-[360px] mx-auto mb-3">
              <ChessBoard
                chess={activeReplayChess}
                boardTheme={DEFAULT_BOARD_THEME}
                orientation="w"
                isInteractive={false}
                onMove={() => {}}
              />
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#161512] border border-[#3c3934]">
              <button
                onClick={() => setReplayStep(0)}
                disabled={replayStep === 0}
                className="px-2 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30"
              >
                Start
              </button>
              <button
                onClick={() => setReplayStep((s) => Math.max(0, s - 1))}
                disabled={replayStep === 0}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>

              <span className="font-mono-chess text-xs font-bold text-[#81b64c]">
                Move {replayStep} / {maxReplaySteps}
              </span>

              <button
                onClick={() => setReplayStep((s) => Math.min(maxReplaySteps, s + 1))}
                disabled={replayStep >= maxReplaySteps}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setReplayStep(maxReplaySteps)}
                disabled={replayStep >= maxReplaySteps}
                className="px-2 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
