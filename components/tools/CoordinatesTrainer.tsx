'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { FILES, ROUND_SECONDS, isDarkSquare, randomSquare, squareAt, type Orientation } from '@/lib/coordinates';

type Phase = 'idle' | 'running' | 'done';
type Mode = 'timed' | 'practice';

const BEST_EVENT = 'gmc-coord-best';
const bestKey = (o: Orientation) => `gmc-coord-best-${o}`;

function readBest(o: Orientation): string {
  try {
    return window.localStorage.getItem(bestKey(o)) ?? '';
  } catch {
    return '';
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(BEST_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(BEST_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}
function saveBest(o: Orientation, score: number) {
  try {
    const prev = Number(window.localStorage.getItem(bestKey(o)) ?? '0');
    if (score > prev) {
      window.localStorage.setItem(bestKey(o), String(score));
      window.dispatchEvent(new Event(BEST_EVENT));
    }
  } catch {
    /* storage can be blocked; the score simply is not remembered */
  }
}

const sel =
  'rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2 text-sm text-zinc-100 focus:border-[#81b64c] focus:outline-none';

export const CoordinatesTrainer: React.FC = () => {
  const [orientation, setOrientation] = useState<Orientation>('white');
  const [mode, setMode] = useState<Mode>('timed');
  const [showCoords, setShowCoords] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [target, setTarget] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [flash, setFlash] = useState<{ square: string; ok: boolean } | null>(null);
  const [reveal, setReveal] = useState<string | null>(null);

  const scoreRef = useRef(0);
  const endsAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const bestRaw = useSyncExternalStore(subscribe, () => readBest(orientation), () => '');
  const best = bestRaw ? Number(bestRaw) : null;

  const stopTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => stopTimer, []);
  // The timer callback reads the latest score from this ref (written here, never during render).
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const finish = () => {
    stopTimer();
    setPhase('done');
    setTarget(null);
    if (mode === 'timed') saveBest(orientation, scoreRef.current);
  };

  const start = () => {
    stopTimer();
    setScore(0);
    setAttempts(0);
    setFlash(null);
    setReveal(null);
    setTimeLeft(ROUND_SECONDS);
    setTarget(randomSquare(null));
    setPhase('running');
    if (mode === 'timed') {
      endsAtRef.current = Date.now() + ROUND_SECONDS * 1000;
      timerRef.current = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000));
        setTimeLeft(left);
        if (left === 0) finish();
      }, 250);
    }
  };

  const answer = (square: string) => {
    if (phase !== 'running' || !target) return;
    const ok = square === target;
    setAttempts((a) => a + 1);
    if (ok) {
      setScore((n) => n + 1);
      setReveal(null);
    } else {
      setReveal(target);
    }
    setFlash({ square, ok });
    window.setTimeout(() => setFlash((f) => (f && f.square === square ? null : f)), 350);
    window.setTimeout(() => setReveal(null), 700);
    setTarget(randomSquare(target));
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  const rows = Array.from({ length: 8 }, (_, r) => r);

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Board view
          <select className={`${sel} mt-1 block`} value={orientation} onChange={(e) => { setOrientation(e.target.value as Orientation); setPhase('idle'); stopTimer(); }} disabled={phase === 'running'}>
            <option value="white">From White&apos;s side</option>
            <option value="black">From Black&apos;s side</option>
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Mode
          <select className={`${sel} mt-1 block`} value={mode} onChange={(e) => { setMode(e.target.value as Mode); setPhase('idle'); stopTimer(); }} disabled={phase === 'running'}>
            <option value="timed">{ROUND_SECONDS}-second challenge</option>
            <option value="practice">Untimed practice</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2 text-xs text-zinc-300">
          <input type="checkbox" checked={showCoords} onChange={(e) => setShowCoords(e.target.checked)} className="h-4 w-4 accent-[#81b64c]" />
          Show coordinates on the board
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,460px)_1fr]">
        <div className="notranslate" translate="no">
          <div role="group" aria-label="Chessboard: click the square that is named" className="mx-auto grid aspect-square w-full max-w-[460px] grid-cols-8 overflow-hidden rounded-lg border border-[#3c3934]">
            {rows.map((r) =>
              rows.map((c) => {
                const sq = squareAt(r, c, orientation);
                const dark = isDarkSquare(sq);
                const isFlashOk = flash?.square === sq && flash.ok;
                const isFlashBad = flash?.square === sq && !flash.ok;
                const isReveal = reveal === sq;
                const bg = isFlashOk ? 'bg-[#81b64c]' : isFlashBad ? 'bg-red-500' : isReveal ? 'bg-[#e8c547]' : dark ? 'bg-[#769656]' : 'bg-[#eeeed2]';
                return (
                  <button
                    key={sq}
                    type="button"
                    onClick={() => answer(sq)}
                    disabled={phase !== 'running'}
                    aria-label={`Row ${r + 1}, column ${c + 1}`}
                    className={`relative aspect-square ${bg} text-[10px] font-semibold ${dark ? 'text-[#eeeed2]' : 'text-[#769656]'} focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e8c547]`}
                  >
                    {showCoords && <span className="absolute left-0.5 top-0">{sq}</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {phase === 'idle' && (
            <div>
              <p className="text-sm text-zinc-300">
                A square name appears. Click that square on the board as fast as you can.
                {mode === 'timed' ? ` You have ${ROUND_SECONDS} seconds.` : ' There is no time limit.'}
              </p>
              {best !== null && mode === 'timed' && <p className="mt-2 text-xs text-zinc-500">Your best on this device: {best}</p>}
              <button type="button" onClick={start} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-[#70a33e]">
                <Play className="h-4 w-4" /> Start
              </button>
            </div>
          )}

          {phase === 'running' && (
            <div aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Find the square</p>
              <p className="notranslate text-6xl font-extrabold tracking-tight text-zinc-100" translate="no">{target}</p>
              <div className="mt-4 flex gap-6 text-sm text-zinc-300">
                <span>Score: <strong className="text-zinc-100">{score}</strong></span>
                {mode === 'timed' && <span>Time: <strong className="text-zinc-100">{timeLeft}s</strong></span>}
                <span>Accuracy: <strong className="text-zinc-100">{accuracy}%</strong></span>
              </div>
              <button type="button" onClick={finish} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#3c3934] bg-[#262421] px-4 py-2 text-xs font-bold text-zinc-200 hover:border-[#81b64c]/60">
                <Square className="h-3.5 w-3.5" /> {mode === 'timed' ? 'End round' : 'Finish'}
              </button>
            </div>
          )}

          {phase === 'done' && (
            <div aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{mode === 'timed' ? 'Time is up' : 'Practice finished'}</p>
              <p className="text-5xl font-extrabold text-zinc-100">{score}</p>
              <p className="text-sm text-zinc-300">correct, {attempts} tries, {accuracy}% accuracy</p>
              {mode === 'timed' && best !== null && <p className="mt-1 text-xs text-zinc-500">Best on this device: {best}</p>}
              <button type="button" onClick={start} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-[#70a33e]">
                <RotateCcw className="h-4 w-4" /> Play again
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-[11px] text-zinc-500">Files run {FILES[0]} to {FILES[7]} and ranks run 1 to 8, counted from White&apos;s side of the board. Your best score is saved only in this browser.</p>
    </div>
  );
};
