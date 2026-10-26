/** Pure helpers for the coordinates trainer (kept separate so they can be tested without a browser). */
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export type Orientation = 'white' | 'black';

/** Name of the square shown at screen row/column (0,0 = top-left) for the given board orientation. */
export function squareAt(row: number, col: number, orientation: Orientation): string {
  const file = orientation === 'white' ? col : 7 - col;
  const rank = orientation === 'white' ? 8 - row : row + 1;
  return `${FILES[file]}${rank}`;
}

/** a1 is a dark square. A square is dark when (file number + rank) is even, counting a=1. */
export function isDarkSquare(square: string): boolean {
  const file = square.charCodeAt(0) - 96;
  const rank = Number(square[1]);
  return (file + rank) % 2 === 0;
}

export function allSquares(): string[] {
  const out: string[] = [];
  for (const f of FILES) for (let r = 1; r <= 8; r++) out.push(`${f}${r}`);
  return out;
}

/** Random square that is never equal to `exclude`. `rng` is injectable for tests. */
export function randomSquare(exclude: string | null, rng: () => number = Math.random): string {
  const pool = allSquares().filter((s) => s !== exclude);
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
}

export const ROUND_SECONDS = 30;
