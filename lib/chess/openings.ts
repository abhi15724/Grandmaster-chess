export interface ChessOpening {
  name: string;
  eco: string;
  moves: string[]; // array of SAN moves
  description: string;
  strategy: string;
}

export const FAMOUS_OPENINGS: ChessOpening[] = [
  {
    name: 'Ruy Lopez (Spanish Opening)',
    eco: 'C60',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: 'One of the oldest and most popular chess openings, developing pieces rapidly and placing pressure on Black’s center defender on c6.',
    strategy: 'White aims to attack e5 indirectly by pinning or eliminating the knight on c6, controlling the center with d4, and castling early.',
  },
  {
    name: 'Sicilian Defense',
    eco: 'B20',
    moves: ['e4', 'c5'],
    description: 'The most popular and dynamic response to 1.e4, leading to asymmetrical, tactical positions where Black fights for center counterplay.',
    strategy: 'Black trades the c-pawn for White’s d-pawn, creating an open c-file and maintaining a central pawn majority.',
  },
  {
    name: "Queen's Gambit",
    eco: 'D06',
    moves: ['d4', 'd5', 'c4'],
    description: 'A fundamental closed opening where White offers the c-pawn to establish dominant central pawn control.',
    strategy: 'If Black accepts with 2...dxc4, White regains the pawn with tempo or seizes the center with e4.',
  },
  {
    name: 'Italian Game (Giuoco Piano)',
    eco: 'C50',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
    description: 'A classical, harmonious opening targeting Black’s vulnerable f7 pawn while maintaining smooth king-safety development.',
    strategy: 'White prepares c3 followed by d4 to establish an ideal pawn center, or plays the quiet d3 Giuoco Pianissimo.',
  },
  {
    name: 'French Defense',
    eco: 'C00',
    moves: ['e4', 'e6', 'd4', 'd5'],
    description: 'A solid, counter-attacking system creating a resilient pawn chain and challenging White’s central dominance on d4.',
    strategy: 'Black builds an unshakeable pawn fortress on d5 and e6, then strikes at White’s center with ...c5 and ...f6.',
  },
  {
    name: "King's Indian Defense",
    eco: 'E60',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    description: 'A hypermodern opening where Black invites White to build a large pawn center, planning to counterattack on the kingside with ...f5.',
    strategy: 'Black castles quickly, plays ...d6, ...e5, and launches a ferocious pawn storm on the White king.',
  },
  {
    name: 'Caro-Kann Defense',
    eco: 'B10',
    moves: ['e4', 'c6', 'd4', 'd5'],
    description: 'An exceptionally solid response with fewer structural weaknesses than the French Defense, keeping the light-squared bishop free.',
    strategy: 'Black contests d5 with ...c6 support, smoothly develops the bishop to f5 or g4, and trades down into advantageous endgames.',
  },
  {
    name: 'London System',
    eco: 'D02',
    moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'],
    description: 'A flexible, universal setup that develops the dark-squared bishop outside the pawn chain before playing e3.',
    strategy: 'White creates a solid pyramid pawn structure with c3 and e3, anchoring an outpost knight on e5.',
  },
];

export function identifyOpening(moveSans: string[]): ChessOpening | null {
  if (!moveSans || moveSans.length === 0) return null;
  let bestMatch: ChessOpening | null = null;
  let maxMatched = 0;

  for (const opening of FAMOUS_OPENINGS) {
    let matchCount = 0;
    for (let i = 0; i < opening.moves.length && i < moveSans.length; i++) {
      if (opening.moves[i] === moveSans[i]) {
        matchCount++;
      } else {
        break;
      }
    }
    if (matchCount >= 2 && matchCount === opening.moves.length && matchCount > maxMatched) {
      maxMatched = matchCount;
      bestMatch = opening;
    }
  }

  return bestMatch;
}
