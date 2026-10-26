'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type Result = 'win' | 'draw' | 'loss';
interface Game {
  id: number;
  opponent: number;
  result: Result;
}

const SCORE: Record<Result, number> = { win: 1, draw: 0.5, loss: 0 };

/** Expected score of a player rated `own` against `opp` (logistic Elo model, 400-point scale). */
export function expectedScore(own: number, opp: number, capDifference: boolean): number {
  let diff = opp - own;
  if (capDifference) diff = Math.max(-400, Math.min(400, diff));
  return 1 / (1 + Math.pow(10, diff / 400));
}

const inputCls =
  'w-full rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2 text-sm text-zinc-100 focus:border-[#81b64c] focus:outline-none';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1';

function clampRating(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(3500, Math.round(n)));
}

export const EloCalculator: React.FC = () => {
  const [rating, setRating] = useState(1500);
  const [kChoice, setKChoice] = useState<'40' | '20' | '10' | 'custom'>('20');
  const [customK, setCustomK] = useState(24);
  const [cap, setCap] = useState(true);
  const [games, setGames] = useState<Game[]>([{ id: 1, opponent: 1700, result: 'win' }]);
  const [nextId, setNextId] = useState(2);

  const k = kChoice === 'custom' ? Math.max(1, Math.min(100, customK || 0)) : Number(kChoice);

  const rows = useMemo(
    () =>
      games.map((g) => {
        const e = expectedScore(rating, g.opponent, cap);
        const s = SCORE[g.result];
        return { ...g, expected: e, score: s, change: k * (s - e) };
      }),
    [games, rating, k, cap]
  );

  const totalChange = rows.reduce((acc, r) => acc + r.change, 0);
  const totalExpected = rows.reduce((acc, r) => acc + r.expected, 0);
  const totalScore = rows.reduce((acc, r) => acc + r.score, 0);
  const newRating = rating + totalChange;

  const updateGame = (id: number, patch: Partial<Game>) =>
    setGames((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6" aria-label="Elo rating calculator">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="elo-rating" className={labelCls}>Your rating</label>
          <input
            id="elo-rating"
            type="number"
            inputMode="numeric"
            min={0}
            max={3500}
            value={rating}
            onChange={(e) => setRating(clampRating(Number(e.target.value)))}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="elo-k" className={labelCls}>K-factor</label>
          <select
            id="elo-k"
            value={kChoice}
            onChange={(e) => setKChoice(e.target.value as typeof kChoice)}
            className={inputCls}
          >
            <option value="40">40: new players (first 30 games) and under-18s rated below 2300</option>
            <option value="20">20: established players rated below 2400</option>
            <option value="10">10: players whose rating has reached 2400</option>
            <option value="custom">Custom (e.g. a club or online site)</option>
          </select>
          {kChoice === 'custom' && (
            <input
              aria-label="Custom K-factor"
              type="number"
              min={1}
              max={100}
              value={customK}
              onChange={(e) => setCustomK(Number(e.target.value))}
              className={`${inputCls} mt-2`}
            />
          )}
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" checked={cap} onChange={(e) => setCap(e.target.checked)} className="h-4 w-4 accent-[#81b64c]" />
            Count rating gaps above 400 as 400 (FIDE rule)
          </label>
        </div>
      </div>

      <div className="mt-6">
        <p className={labelCls}>Games</p>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={r.id} className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-1 text-xs text-zinc-500">{i + 1}</span>
              <div className="col-span-4 sm:col-span-3">
                <input
                  aria-label={`Opponent rating, game ${i + 1}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={3500}
                  value={r.opponent}
                  onChange={(e) => updateGame(r.id, { opponent: clampRating(Number(e.target.value)) })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <select
                  aria-label={`Result, game ${i + 1}`}
                  value={r.result}
                  onChange={(e) => updateGame(r.id, { result: e.target.value as Result })}
                  className={inputCls}
                >
                  <option value="win">Win</option>
                  <option value="draw">Draw</option>
                  <option value="loss">Loss</option>
                </select>
              </div>
              <div className="col-span-2 hidden text-right text-xs text-zinc-400 sm:block">E = {r.expected.toFixed(2)}</div>
              <div className={`col-span-2 text-right text-sm font-bold ${r.change >= 0 ? 'text-[#81b64c]' : 'text-red-400'}`}>
                {r.change >= 0 ? '+' : ''}
                {r.change.toFixed(1)}
              </div>
              <button
                type="button"
                aria-label={`Remove game ${i + 1}`}
                onClick={() => setGames((gs) => (gs.length > 1 ? gs.filter((g) => g.id !== r.id) : gs))}
                className="col-span-1 flex justify-end text-zinc-500 hover:text-red-400 disabled:opacity-30"
                disabled={games.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setGames((gs) => [...gs, { id: nextId, opponent: rating, result: 'draw' }]);
            setNextId((n) => n + 1);
          }}
          disabled={games.length >= 20}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2 text-xs font-bold text-zinc-100 hover:border-[#81b64c]/50 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" /> Add game
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-[#3c3934] bg-[#161512] p-4 sm:grid-cols-3" aria-live="polite">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">Expected score</p>
          <p className="text-lg font-bold text-zinc-100">
            {totalExpected.toFixed(2)} <span className="text-xs font-normal text-zinc-500">of {games.length}</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">Actual score</p>
          <p className="text-lg font-bold text-zinc-100">{totalScore.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">New rating</p>
          <p className="text-lg font-bold text-zinc-100">
            {newRating.toFixed(1)}{' '}
            <span className={`text-sm ${totalChange >= 0 ? 'text-[#81b64c]' : 'text-red-400'}`}>
              ({totalChange >= 0 ? '+' : ''}
              {totalChange.toFixed(1)})
            </span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Change = K × (score − expected score), summed over the games. All games are rated from your starting rating, as in a single rating period.
      </p>
    </div>
  );
};
