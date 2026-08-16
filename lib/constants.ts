import { TimeControlConfig, TimeControlPreset } from '@/types/chess';

export const TIME_CONTROLS: Record<TimeControlPreset, TimeControlConfig> = {
  'none': {
    id: 'none',
    label: 'Untimed',
    category: 'Untimed',
    initialSeconds: 0,
    incrementSeconds: 0,
  },
  '1+0': {
    id: '1+0',
    label: '1 min Bullet',
    category: 'Bullet',
    initialSeconds: 60,
    incrementSeconds: 0,
  },
  '3+0': {
    id: '3+0',
    label: '3 min Blitz',
    category: 'Blitz',
    initialSeconds: 180,
    incrementSeconds: 0,
  },
  '5+0': {
    id: '5+0',
    label: '5 min Blitz',
    category: 'Blitz',
    initialSeconds: 300,
    incrementSeconds: 0,
  },
  '10+0': {
    id: '10+0',
    label: '10 min Rapid',
    category: 'Rapid',
    initialSeconds: 600,
    incrementSeconds: 0,
  },
  '15+10': {
    id: '15+10',
    label: '15+10 Rapid',
    category: 'Rapid',
    initialSeconds: 900,
    incrementSeconds: 10,
  },
};

export const QUICK_CHAT_MESSAGES = [
  'Good luck & have fun! 🤝',
  'Nice move! 👏',
  'Well played! ✨',
  'Thinking... 🤔',
  'Good game! 🏆',
  'Rematch? ⚔️',
  'Thanks for the game! 🙏',
];

export const CHESS_STRATEGIES = [
  {
    title: 'Control the Center (e4, d4, e5, d5)',
    category: 'Fundamentals',
    icon: 'target',
    summary: 'The four central squares control the largest portion of the board and allow your pieces to maneuver quickly from one flank to another.',
    tips: [
      'Occupy the center with pawns early (1.e4 or 1.d4).',
      'Support central pawns with knights (Nf3, Nc3).',
      'Never surrender center control without concrete tactical compensation.',
    ],
  },
  {
    title: 'Develop Minor Pieces Rapidly',
    category: 'Opening Principle',
    icon: 'zap',
    summary: 'Knights before Bishops is a golden rule. Get your pieces out of the back rank so they can fight and guard the king.',
    tips: [
      'Avoid moving the same piece multiple times in the opening.',
      'Develop toward the center (e.g. Nf3 instead of Nh3).',
      'Do not bring your Queen out too early where it can be harassed with tempo.',
    ],
  },
  {
    title: 'King Safety & Early Castling',
    category: 'Defense',
    icon: 'shield',
    summary: 'Leaving your king uncastled in the center of an open board is an invitation to rapid mating attacks.',
    tips: [
      'Castle within the first 7-10 moves whenever possible.',
      'Maintain the pawn shield (f2, g2, h2 or f7, g7, h7) intact in front of your castled king.',
      'Create a "luft" (escape square like h3) if back-rank mate threats arise in the endgame.',
    ],
  },
  {
    title: 'Master Tactical Motifs',
    category: 'Tactics',
    icon: 'swords',
    summary: 'Most games at amateur and intermediate levels are decided by basic tactical motifs: Forks, Pins, Skewers, and Discovered Checks.',
    tips: [
      'Fork: One piece (especially Knight or Pawn) attacks two enemy pieces at once.',
      'Pin: A piece cannot move because it would expose a higher value piece behind it.',
      'Skewer: A valuable piece is attacked and forced to move, exposing a lesser piece behind.',
      'Discovered Attack: Moving one piece unveils an attack from a long-range piece behind it.',
    ],
  },
  {
    title: 'Rook on Open Files & 7th Rank',
    category: 'Middlegame',
    icon: 'columns',
    summary: 'Rooks thrive on open files (no pawns) and semi-open files. A rook placed on the 7th rank (the "pig on the 7th") terrorizes enemy pawns and the enemy king.',
    tips: [
      'Connect your rooks by moving the queen off the back rank.',
      'Double rooks on an open file to achieve unstoppable penetration.',
      'Place rooks behind passed pawns in endgames.',
    ],
  },
];
