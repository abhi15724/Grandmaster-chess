export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type Square = string; // e.g. 'e4', 'd7'

export type GameMode = 'ai' | 'local' | 'replay';
export type AIDifficulty = 'basic' | 'intermediate' | 'advanced';

export type TimeControlPreset = '1+0' | '3+0' | '5+0' | '10+0' | '15+10' | 'none';

export interface TimeControlConfig {
  id: TimeControlPreset;
  label: string;
  category: 'Bullet' | 'Blitz' | 'Rapid' | 'Untimed';
  initialSeconds: number; // 0 for untimed
  incrementSeconds: number;
}

export type GameStatus =
  | 'waiting'
  | 'active'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw_agreement'
  | 'draw_repetition'
  | 'draw_fifty_moves'
  | 'draw_insufficient_material'
  | 'resigned'
  | 'timeout'
  | 'abandoned';

export interface MoveRecord {
  san: string;
  from: Square;
  to: Square;
  piece: PieceType;
  color: PieceColor;
  captured?: PieceType;
  promotion?: PieceType;
  fenBefore: string;
  fenAfter: string;
  timeSpentMs?: number;
  evalScore?: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  color: PieceColor;
  rating?: number;
  avatarSeed?: string;
  connected?: boolean;
  timeRemaining: number; // in seconds or milliseconds
  capturedPieces: PieceType[];
}

export interface BoardTheme {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  highlightSelected: string;
  highlightMove: string;
  highlightCheck: string;
  highlightLastMove: string;
  borderClass: string;
  previewColor: string;
}

export interface UserStats {
  id: string;
  name: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  history: SavedGameSummary[];
}

export interface SavedGameSummary {
  id: string;
  date: string;
  mode: GameMode;
  opponentName: string;
  playerColor: PieceColor;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  movesCount: number;
  pgn: string;
  fenFinal: string;
}
