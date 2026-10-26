import { Chess } from 'chess.js';

export interface PgnMove {
  /** Move in standard algebraic notation, e.g. "Nf3" */
  san: string;
  from: string;
  to: string;
  /** Position after this move */
  fen: string;
  color: 'w' | 'b';
  /** Full-move number the move belongs to (1, 1, 2, 2, ...) */
  moveNumber: number;
}

export type ParsedGame =
  | {
      ok: true;
      headers: Record<string, string>;
      startFen: string;
      moves: PgnMove[];
      /** Plain-English result of the final position, if the game is over on the board. */
      ending: string | null;
      /** True if the input held several games and only the first was loaded. */
      multipleGames: boolean;
    }
  | { ok: false; error: string };

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const MAX_INPUT_CHARS = 200_000;

/** A FEN has 6 space-separated fields and a slash-separated board of 8 ranks. */
export function looksLikeFen(text: string): boolean {
  const t = text.trim();
  return !t.includes('\n') && !t.includes('[') && t.split(/\s+/).length >= 4 && t.split('/').length === 8;
}

/** Removes {comments}, ;line comments, (variations) and $NAGs so a plainer parser can read the movetext. */
export function stripAnnotations(pgn: string): string {
  let out = pgn.replace(/\{[^}]*\}/g, ' ').replace(/;[^\n]*/g, ' ');
  let prev: string;
  do {
    prev = out;
    out = out.replace(/\([^()]*\)/g, ' ');
  } while (out !== prev);
  return out.replace(/\$\d+/g, ' ');
}

function endingOf(game: Chess): string | null {
  if (game.isCheckmate()) return `Checkmate. ${game.turn() === 'w' ? 'Black' : 'White'} wins on the board.`;
  if (game.isStalemate()) return 'Stalemate: a draw.';
  if (game.isInsufficientMaterial()) return 'Draw by insufficient material.';
  if (game.isThreefoldRepetition()) return 'Draw by threefold repetition.';
  if (game.isDraw()) return 'Draw (fifty-move rule).';
  return null;
}

function splitFirstGame(text: string): { first: string; multiple: boolean } {
  const parts = text.split(/\n\s*\n(?=\[Event )/);
  return { first: parts[0], multiple: parts.length > 1 };
}

export function parsePgn(input: string): ParsedGame {
  const text = input.replace(/\r\n?/g, '\n').trim();
  if (!text) return { ok: false, error: 'Paste a PGN (the moves of a game) or a FEN (a single position) to begin.' };
  if (text.length > MAX_INPUT_CHARS) return { ok: false, error: 'That is too long. Paste a single game (under 200,000 characters).' };

  try {
    if (looksLikeFen(text)) {
      const g = new Chess(text);
      return { ok: true, headers: {}, startFen: g.fen(), moves: [], ending: endingOf(g), multipleGames: false };
    }

    const { first, multiple } = splitFirstGame(text);
    let game = new Chess();
    try {
      game.loadPgn(first);
    } catch {
      game = new Chess();
      game.loadPgn(stripAnnotations(first));
    }

    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(game.getHeaders())) if (v) headers[k] = String(v);
    const startFen = headers.FEN && headers.SetUp !== '0' ? headers.FEN : START_FEN;

    const replay = new Chess(startFen);
    const moves: PgnMove[] = [];
    for (const m of game.history({ verbose: true })) {
      const color = replay.turn();
      const moveNumber = parseInt(replay.fen().split(' ')[5], 10);
      const made = replay.move(m.san);
      moves.push({ san: made.san, from: made.from, to: made.to, fen: replay.fen(), color, moveNumber });
    }
    return { ok: true, headers, startFen, moves, ending: endingOf(replay), multipleGames: multiple };
  } catch (e) {
    const detail = e instanceof Error ? e.message.split('\n')[0] : 'unknown problem';
    return { ok: false, error: `Could not read that as a legal game: ${detail}` };
  }
}

/** The Opera Game (Morphy vs Duke of Brunswick and Count Isouard, Paris, 1858). */
export const SAMPLE_PGN = `[Event "Opera Game"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[Round "?"]
[White "Paul Morphy"]
[Black "Duke of Brunswick and Count Isouard"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7
8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7
14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`;
