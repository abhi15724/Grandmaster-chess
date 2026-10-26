import { Chess } from 'chess.js';

/**
 * Renders ```fen code blocks from blog markdown as inline SVG chess diagrams.
 *
 * Block format (one line):   <FEN> | <caption> | hl=e4,e5
 *   - FEN: full FEN, or just the piece-placement field (side to move defaults to white).
 *   - caption: shown under the board and used as the SVG accessible name.
 *   - hl=...: optional comma list of squares to highlight.
 *
 * Illegal FENs throw at build time so a bad diagram can never be published.
 */

const GLYPH: Record<string, string> = {
  K: '\u2654', Q: '\u2655', R: '\u2656', B: '\u2657', N: '\u2658', P: '\u2659',
  k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F',
};

const FILES = 'abcdefgh';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function unesc(s: string): string {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

export interface BoardSvgOptions {
  highlights?: string[];
  flip?: boolean;
  /** Accessible name for the SVG. */
  label?: string;
}

/** Just the <svg> element for a position (used by the figure wrapper and by interactive tools). */
export function fenToBoardSvg(fenInput: string, opts: BoardSvgOptions = {}): { svg: string; turn: 'White' | 'Black'; fen: string } {
  const fen = fenInput.trim().split(/\s+/).length === 1 ? `${fenInput.trim()} w - - 0 1` : fenInput.trim();
  // Validates piece placement and basic legality; throws on a bad FEN.
  const game = new Chess(fen);
  const board = game.board();
  const flip = !!opts.flip;
  const S = 40; // square size
  const M = 16; // margin for coordinates
  const size = S * 8 + M * 2;
  const hl = new Set((opts.highlights ?? []).map((h) => h.trim().toLowerCase()).filter(Boolean));

  let squares = '';
  let pieces = '';
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const rr = flip ? 7 - r : r; // board row shown at screen row r
      const ff = flip ? 7 - f : f;
      const x = M + f * S;
      const y = M + r * S;
      const light = (rr + ff) % 2 === 0;
      const sq = `${FILES[ff]}${8 - rr}`;
      const fill = hl.has(sq) ? '#e8c547' : light ? '#eeeed2' : '#769656';
      squares += `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${fill}"/>`;
      const piece = board[rr][ff];
      if (piece) {
        const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
        const isWhite = piece.color === 'w';
        pieces += `<text x="${x + S / 2}" y="${y + S * 0.76}" font-size="${S * 0.82}" text-anchor="middle" fill="${isWhite ? '#ffffff' : '#111111'}" stroke="${isWhite ? '#111111' : '#ffffff'}" stroke-width="${isWhite ? 0.9 : 0.4}" paint-order="stroke" font-family="'Segoe UI Symbol','Noto Sans Symbols 2','DejaVu Sans',serif">${GLYPH[key]}</text>`;
      }
    }
  }
  let coords = '';
  for (let i = 0; i < 8; i++) {
    coords += `<text x="${M + i * S + S / 2}" y="${size - 4}" font-size="10" text-anchor="middle" fill="#a1a1aa">${FILES[flip ? 7 - i : i]}</text>`;
    coords += `<text x="5" y="${M + i * S + S / 2 + 3}" font-size="10" text-anchor="middle" fill="#a1a1aa">${flip ? i + 1 : 8 - i}</text>`;
  }
  const turn = game.turn() === 'w' ? 'White' : 'Black';
  const label = `${opts.label || 'Chess position'} (${turn} to move)`;
  const svg =
    `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;border-radius:6px;background:#262421">` +
    `<title>${esc(label)}</title>${squares}${pieces}${coords}</svg>`;
  return { svg, turn, fen };
}

export function fenToSvg(fenInput: string, caption: string, highlights: string[] = []): string {
  const { svg, turn, fen } = fenToBoardSvg(fenInput, { highlights, label: caption });
  return (
    `<figure class="chess-diagram" style="margin:1.5rem auto;max-width:360px">` +
    svg +
    `<figcaption style="margin-top:.5rem;font-size:.8rem;color:#a1a1aa;text-align:center">${esc(caption)}${caption ? ' ' : ''}<span style="color:#71717a">${turn} to move. FEN: <code>${esc(fen)}</code></span></figcaption>` +
    `</figure>`
  );
}

/** Replace <pre><code class="language-fen">…</code></pre> (as produced by remark-html) with SVG figures. */
export function renderFenBlocks(html: string): string {
  return html.replace(
    /<pre><code class="language-fen">([\s\S]*?)<\/code><\/pre>/g,
    (_m, body: string) => {
      const line = unesc(body).trim();
      const [fen, caption = '', extra = ''] = line.split('|').map((p) => p.trim());
      const hl = extra.toLowerCase().startsWith('hl=') ? extra.slice(3).split(',') : [];
      return fenToSvg(fen, caption, hl);
    }
  );
}
