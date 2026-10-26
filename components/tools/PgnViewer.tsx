'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Play, Pause, FlipVertical, Copy, Check, Eraser } from 'lucide-react';
import { parsePgn, SAMPLE_PGN } from '@/lib/pgn-tools';
import { fenToBoardSvg } from '@/lib/fen-diagram';

const SHOWN_HEADERS = ['Event', 'Site', 'Date', 'Round', 'White', 'Black', 'Result'] as const;

const btn =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3c3934] bg-[#262421] text-zinc-200 hover:border-[#81b64c]/60 disabled:opacity-35 disabled:hover:border-[#3c3934]';

export const PgnViewer: React.FC = () => {
  const [text, setText] = useState(SAMPLE_PGN);
  const [index, setIndex] = useState(0); // 0 = start position, n = after n-th ply
  const [flip, setFlip] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeMoveRef = useRef<HTMLButtonElement | null>(null);

  const parsed = useMemo(() => parsePgn(text), [text]);
  const moves = parsed.ok ? parsed.moves : [];
  const total = moves.length;
  const safeIndex = Math.min(index, total);
  const isPlaying = playing && safeIndex < total;

  // Autoplay: the interval callback advances; it stops by itself at the end (isPlaying turns false).
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => setIndex((i) => Math.min(i + 1, total)), 900);
    return () => window.clearInterval(id);
  }, [isPlaying, total]);

  // Keep the current move visible in the move list.
  useEffect(() => {
    activeMoveRef.current?.scrollIntoView({ block: 'nearest' });
  }, [safeIndex]);

  const board = useMemo(() => {
    if (!parsed.ok) return null;
    const fen = safeIndex === 0 ? parsed.startFen : parsed.moves[safeIndex - 1].fen;
    const last = safeIndex > 0 ? parsed.moves[safeIndex - 1] : null;
    const label = last
      ? `Position after ${last.color === 'w' ? `${last.moveNumber}.` : `${last.moveNumber}...`} ${last.san}`
      : 'Starting position';
    const out = fenToBoardSvg(fen, { highlights: last ? [last.from, last.to] : [], flip, label });
    return { ...out, label };
  }, [parsed, safeIndex, flip]);

  const go = (n: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(total, n)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(safeIndex - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(safeIndex + 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(total); }
  };

  const copyFen = async () => {
    if (!board) return;
    try {
      await navigator.clipboard.writeText(board.fen);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard can be unavailable; the FEN stays selectable in the box */
    }
  };

  const onText = (value: string) => {
    setText(value);
    setIndex(0);
    setPlaying(false);
  };

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6" onKeyDown={onKeyDown}>
      <label htmlFor="pgn-input" className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-400">
        Paste a PGN (game) or a FEN (position)
      </label>
      <textarea
        id="pgn-input"
        value={text}
        onChange={(e) => onText(e.target.value)}
        rows={7}
        spellCheck={false}
        className="w-full rounded-lg border border-[#3c3934] bg-[#262421] p-3 font-mono text-xs text-zinc-100 focus:border-[#81b64c] focus:outline-none"
        placeholder={'[Event "Casual game"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6'}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => onText(SAMPLE_PGN)} className="rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-[#81b64c]/60">
          Load sample game
        </button>
        <button type="button" onClick={() => onText('')} className="inline-flex items-center gap-1 rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-[#81b64c]/60">
          <Eraser className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {!parsed.ok && (
        <p role="alert" className="mt-4 rounded-lg border border-[#3c3934] bg-[#161512] p-3 text-sm text-zinc-300">
          {parsed.error}
        </p>
      )}

      {parsed.ok && board && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div>
            <div className="notranslate" translate="no" dangerouslySetInnerHTML={{ __html: board.svg }} />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Move controls">
              <button type="button" className={btn} onClick={() => go(0)} disabled={safeIndex === 0} aria-label="Go to start"><ChevronFirst className="h-4 w-4" /></button>
              <button type="button" className={btn} onClick={() => go(safeIndex - 1)} disabled={safeIndex === 0} aria-label="Previous move"><ChevronLeft className="h-4 w-4" /></button>
              <button
                type="button"
                className={btn}
                onClick={() => (isPlaying ? setPlaying(false) : (safeIndex >= total ? setIndex(0) : null, setPlaying(true)))}
                disabled={total === 0}
                aria-label={isPlaying ? 'Pause autoplay' : 'Play moves automatically'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button type="button" className={btn} onClick={() => go(safeIndex + 1)} disabled={safeIndex >= total} aria-label="Next move"><ChevronRight className="h-4 w-4" /></button>
              <button type="button" className={btn} onClick={() => go(total)} disabled={safeIndex >= total} aria-label="Go to end"><ChevronLast className="h-4 w-4" /></button>
              <button type="button" className={btn} onClick={() => setFlip((f) => !f)} aria-label="Flip board" aria-pressed={flip}><FlipVertical className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-center text-xs text-zinc-500" aria-live="polite">
              {total > 0 ? `Move ${safeIndex} of ${total}. Use the arrow keys to step.` : 'Position only (no moves).'}
            </p>
          </div>

          <div className="min-w-0">
            {Object.keys(parsed.headers).length > 0 && (
              <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                {SHOWN_HEADERS.filter((h) => parsed.headers[h] && parsed.headers[h] !== '?').map((h) => (
                  <React.Fragment key={h}>
                    <dt className="font-bold text-zinc-500">{h}</dt>
                    <dd className="break-words text-zinc-200">{parsed.headers[h]}</dd>
                  </React.Fragment>
                ))}
              </dl>
            )}

            {total > 0 && (
              <div className="notranslate max-h-56 overflow-y-auto rounded-lg border border-[#3c3934] bg-[#161512] p-2" translate="no">
                <ol className="flex flex-wrap gap-x-1 gap-y-1 text-sm">
                  {moves.map((m, i) => (
                    <li key={i} className="flex items-center">
                      {m.color === 'w' && <span className="mr-1 text-xs text-zinc-500">{m.moveNumber}.</span>}
                      {m.color === 'b' && i === 0 && <span className="mr-1 text-xs text-zinc-500">{m.moveNumber}...</span>}
                      <button
                        type="button"
                        ref={i + 1 === safeIndex ? activeMoveRef : null}
                        onClick={() => go(i + 1)}
                        aria-current={i + 1 === safeIndex ? 'step' : undefined}
                        className={`rounded px-1.5 py-0.5 font-semibold ${i + 1 === safeIndex ? 'bg-[#81b64c] text-zinc-950' : 'text-zinc-200 hover:bg-[#3c3934]'}`}
                      >
                        {m.san}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {parsed.multipleGames && (
              <p className="mt-3 text-xs text-zinc-400">Several games were pasted. Only the first one is shown.</p>
            )}
            {safeIndex === total && parsed.ending && <p className="mt-3 text-sm font-semibold text-[#81b64c]">{parsed.ending}</p>}

            <label htmlFor="pgn-fen" className="mt-4 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              FEN of this position
            </label>
            <div className="mt-1 flex gap-2">
              <input id="pgn-fen" readOnly value={board.fen} className="notranslate w-full min-w-0 rounded-lg border border-[#3c3934] bg-[#262421] px-2 py-2 font-mono text-xs text-zinc-100" translate="no" onFocus={(e) => e.currentTarget.select()} />
              <button type="button" onClick={copyFen} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#3c3934] bg-[#262421] px-3 text-xs font-semibold text-zinc-200 hover:border-[#81b64c]/60">
                {copied ? <Check className="h-3.5 w-3.5 text-[#81b64c]" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
