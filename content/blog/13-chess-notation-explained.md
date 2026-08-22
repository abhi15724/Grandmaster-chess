---
title: "Chess Notation Explained: How to Read and Write Algebraic Chess Moves"
description: "A clear, practical guide to algebraic chess notation — the coordinate system, piece letters, captures, check, castling, and promotion, with a worked example."
date: "2026-08-20"
updated: "2026-08-20"
author: "Grandmaster Chess Editorial Team"
category: "Rules"
tags: ["chess notation explained", "algebraic notation chess", "how to read chess moves", "chess notation for beginners"]
readingMinutes: 6
---

Algebraic notation is the standard way chess moves are written down — it's what you see in books, on broadcasts, and in every game's move history here. Once you know the pattern, reading it takes about ten minutes to learn and a few games to feel natural.

## The coordinate system

Every square on the board has a unique address, built from two things:

- **Files** — the eight columns, labeled `a` through `h`, left to right from White's side of the board.
- **Ranks** — the eight rows, numbered `1` through `8`, starting from White's side.

Combine them and every square gets one unique label: `e4`, `a1`, `h8`, and so on. White's king starts on `e1`; Black's king starts on `e8`. That's the entire coordinate system — the rest of notation is just describing which piece moved to which square.

## Piece letters

Each piece (except pawns) gets a single capital letter when it moves:

- **K** — King
- **Q** — Queen
- **R** — Rook
- **B** — Bishop
- **N** — Knight (not "K" — that's reserved for King)

Pawns get no letter at all. A move like `e4` on its own means "a pawn moved to e4" — if it were the knight, it would be written `Ne4`.

## Captures, check, and checkmate

A few symbols added after the piece and square carry extra meaning:

- **x** — a capture happened. `Nxe4` means "knight captures on e4."
- **+** — the move puts the opposing king in check. `Qh5+` means "queen moves to h5, giving check."
- **#** — the move is checkmate. `Qh7#` means "queen moves to h7, checkmate."
- **=** — pawn promotion. `e8=Q` means "pawn moves to e8 and promotes to a queen."

## Castling

Castling has its own special notation, since it moves two pieces (king and rook) in one move:

- **O-O** — kingside castling (the king's side of the board, toward `g1`/`g8`)
- **O-O-O** — queenside castling (toward `c1`/`c8`)

## When two pieces could make the same move

If two identical pieces could both move to the same square, notation adds a disambiguating letter or number. `Nbd7` means "the knight on the b-file moves to d7" — used specifically because another knight could also reach d7, so the file tells you which one moved.

## A worked example

Here's the opening sequence of a real game, in standard notation, with what each move means:

```
1. e4 e5
2. Nf3 Nc6
3. Bb5 a6
```

- `1. e4` — White's pawn moves to e4.
- `1... e5` — Black's pawn moves to e5 in response.
- `2. Nf3` — White's knight moves to f3.
- `2... Nc6` — Black's knight moves to c6.
- `3. Bb5` — White's bishop moves to b5. (This particular sequence is the start of the [Ruy Lopez](/learn/chess-openings), one of the oldest and most studied openings in chess.)
- `3... a6` — Black's pawn moves to a6, challenging the bishop.

That's the entire skill: piece letter (if any) + destination square, plus the handful of symbols above for captures, check, castling, and promotion.

## Frequently asked questions

**Why don't pawns get a letter in chess notation?**
Pawns are the default piece — if a move has no capital letter in front of it, it's assumed to be a pawn move. Every other piece needs its letter specifically because there'd otherwise be no way to tell them apart.

**What does "e.p." mean in chess notation?**
It marks an en passant capture — a special pawn capture rule. You'll sometimes see it added after a move like `exd6 e.p.` for clarity, though many scoresheets omit it since the move itself is still legal and unambiguous without the tag.

**Is algebraic notation the same worldwide?**
Yes, with minor regional variations in piece letters (some languages use their own initials — for example, "T" for "Tour" in French for Rook), but the coordinate system and overall structure are the same everywhere and universally understood by players and software alike.

**Do I need to know notation to play chess online here?**
No — you can play entirely by clicking or dragging pieces. Notation becomes useful once you want to review your [move history](/dashboard), study openings, or read chess books and analysis.

Once notation clicks, a whole world of chess writing opens up — try following along with a game against the [AI](/play/ai) and reading back your own move list afterward.
