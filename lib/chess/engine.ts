import { Chess, Move } from 'chess.js';
import { PieceColor, AIDifficulty } from '@/types/chess';
import { evaluateBoard, PIECE_VALUES } from './evaluator';
import { FAMOUS_OPENINGS } from './openings';

export interface BestMoveResult {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  evalScore: number;
}

export interface ChessEngine {
  findBestMove(fen: string, color: PieceColor): Promise<BestMoveResult>;
}

// -------------------------------------------------------------
// BASIC ENGINE (Beginner Friendly)
// -------------------------------------------------------------
export class BasicEngine implements ChessEngine {
  async findBestMove(fen: string, color: PieceColor): Promise<BestMoveResult> {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });

    if (moves.length === 0) {
      throw new Error('No legal moves available');
    }

    // 40% chance of making a random legal move for beginner feel
    if (Math.random() < 0.45) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      chess.move(randomMove);
      const evalScore = evaluateBoard(chess);
      return {
        from: randomMove.from,
        to: randomMove.to,
        promotion: randomMove.promotion,
        san: randomMove.san,
        evalScore,
      };
    }

    // Otherwise pick best 1-ply capture or position
    let bestMove: Move = moves[0];
    let bestScore = color === 'w' ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      const score = evaluateBoard(chess) + (Math.random() * 30 - 15); // slight noise
      chess.undo();

      if (color === 'w' ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion,
      san: bestMove.san,
      evalScore: bestScore,
    };
  }
}

// -------------------------------------------------------------
// INTERMEDIATE ENGINE (Minimax with Alpha-Beta, Depth 3)
// -------------------------------------------------------------
export class IntermediateEngine implements ChessEngine {
  private maxDepth = 3;

  async findBestMove(fen: string, color: PieceColor): Promise<BestMoveResult> {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });

    if (moves.length === 0) {
      throw new Error('No legal moves available');
    }

    // Check opening book for first few moves
    const currentSans = chess.history();
    if (currentSans.length < 4) {
      for (const op of FAMOUS_OPENINGS) {
        if (op.moves.length > currentSans.length) {
          let match = true;
          for (let i = 0; i < currentSans.length; i++) {
            if (op.moves[i] !== currentSans[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            const nextSan = op.moves[currentSans.length];
            const matchingMove = moves.find((m) => m.san === nextSan);
            if (matchingMove) {
              chess.move(matchingMove);
              const score = evaluateBoard(chess);
              return {
                from: matchingMove.from,
                to: matchingMove.to,
                promotion: matchingMove.promotion,
                san: matchingMove.san,
                evalScore: score,
              };
            }
          }
        }
      }
    }

    // Order moves: captures first
    const sortedMoves = this.orderMoves(chess, moves);
    let bestMove = sortedMoves[0];
    let isMaximizing = color === 'w';
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of sortedMoves) {
      chess.move(move);
      const score = this.minimax(chess, this.maxDepth - 1, alpha, beta, !isMaximizing);
      chess.undo();

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) {
        break;
      }
    }

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion,
      san: bestMove.san,
      evalScore: bestScore,
    };
  }

  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (depth === 0 || chess.isGameOver()) {
      return evaluateBoard(chess);
    }

    const moves = this.orderMoves(chess, chess.moves({ verbose: true }));
    if (moves.length === 0) return evaluateBoard(chess);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evalScore = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evalScore = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  protected orderMoves(chess: Chess, moves: Move[]): Move[] {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.captured) {
        scoreA += PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece];
      }
      if (b.captured) {
        scoreB += PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece];
      }
      if (a.promotion) scoreA += 800;
      if (b.promotion) scoreB += 800;
      return scoreB - scoreA;
    });
  }
}

// -------------------------------------------------------------
// ADVANCED ENGINE (Minimax with Alpha-Beta + Quiescence, Depth 4)
// -------------------------------------------------------------
export class AdvancedEngine extends IntermediateEngine implements ChessEngine {
  private advDepth = 4;

  async findBestMove(fen: string, color: PieceColor): Promise<BestMoveResult> {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });

    if (moves.length === 0) {
      throw new Error('No legal moves available');
    }

    // Opening book
    const currentSans = chess.history();
    if (currentSans.length < 6) {
      for (const op of FAMOUS_OPENINGS) {
        if (op.moves.length > currentSans.length) {
          let match = true;
          for (let i = 0; i < currentSans.length; i++) {
            if (op.moves[i] !== currentSans[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            const nextSan = op.moves[currentSans.length];
            const matchingMove = moves.find((m) => m.san === nextSan);
            if (matchingMove) {
              chess.move(matchingMove);
              const score = evaluateBoard(chess);
              return {
                from: matchingMove.from,
                to: matchingMove.to,
                promotion: matchingMove.promotion,
                san: matchingMove.san,
                evalScore: score,
              };
            }
          }
        }
      }
    }

    const sortedMoves = this.orderMoves(chess, moves);
    let bestMove = sortedMoves[0];
    let isMaximizing = color === 'w';
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of sortedMoves) {
      chess.move(move);
      const score = this.minimaxAdvanced(chess, this.advDepth - 1, alpha, beta, !isMaximizing);
      chess.undo();

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) break;
    }

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion,
      san: bestMove.san,
      evalScore: bestScore,
    };
  }

  private minimaxAdvanced(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (depth === 0) {
      return this.quiescence(chess, alpha, beta, isMaximizing, 2);
    }
    if (chess.isGameOver()) {
      return evaluateBoard(chess);
    }

    const moves = this.orderMoves(chess, chess.moves({ verbose: true }));
    if (moves.length === 0) return evaluateBoard(chess);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evalScore = this.minimaxAdvanced(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evalScore = this.minimaxAdvanced(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  /**
   * Quiescence search to avoid horizon effect on tactical captures
   */
  private quiescence(
    chess: Chess,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    qDepth: number
  ): number {
    const standPat = evaluateBoard(chess);

    if (qDepth === 0 || chess.isGameOver()) {
      return standPat;
    }

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      alpha = Math.max(alpha, standPat);

      const captureMoves = this.orderMoves(
        chess,
        chess.moves({ verbose: true }).filter((m) => m.captured || m.promotion)
      );

      for (const move of captureMoves) {
        chess.move(move);
        const score = this.quiescence(chess, alpha, beta, false, qDepth - 1);
        chess.undo();

        if (score >= beta) return beta;
        alpha = Math.max(alpha, score);
      }
      return alpha;
    } else {
      if (standPat <= alpha) return alpha;
      beta = Math.min(beta, standPat);

      const captureMoves = this.orderMoves(
        chess,
        chess.moves({ verbose: true }).filter((m) => m.captured || m.promotion)
      );

      for (const move of captureMoves) {
        chess.move(move);
        const score = this.quiescence(chess, alpha, beta, true, qDepth - 1);
        chess.undo();

        if (score <= alpha) return alpha;
        beta = Math.min(beta, score);
      }
      return beta;
    }
  }
}

/**
 * Engine factory
 */
export function getEngine(difficulty: AIDifficulty): ChessEngine {
  switch (difficulty) {
    case 'basic':
      return new BasicEngine();
    case 'intermediate':
      return new IntermediateEngine();
    case 'advanced':
    default:
      return new AdvancedEngine();
  }
}
