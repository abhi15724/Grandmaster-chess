---
title: "How Many Possible Chess Games Are There? The Actual Math"
description: "The real numbers behind chess's complexity — the Shannon number, legal position counts, and how fast the possibilities explode move by move."
date: "2026-08-25"
updated: "2026-10-23"
author: "Grandmaster Chess Editorial Team"
category: "Trivia"
tags: ["how many chess games possible", "shannon number", "chess math", "chess trivia", "legal chess positions"]
readingMinutes: 6
factChecked: "2026-10-23"
sources:
  - title: "John Tromp: The number of legal chess positions is ~4.8 x 10^44 (TalkChess)"
    url: "https://www.talkchess.com/viewtopic.php?p=975229"
  - title: "Tromp and Österlund: ChessPositionRanking (sampling method and code)"
    url: "https://github.com/tromp/ChessPositionRanking"
  - title: "Chessprogramming wiki: Perft Results"
    url: "https://www.chessprogramming.org/Perft_Results"
---

The commonly quoted answer is **10^120** — a 1 followed by 120 zeros, known as the Shannon number. For comparison, there are an estimated 10^80 atoms in the entire observable universe. Chess, played on a 64-square board with 32 pieces, has more possible games than there are atoms in existence. That number needs some unpacking, because it's actually the answer to a slightly different question than most people think they're asking.

## Games vs. positions — two different numbers

This is where most casual explanations get muddled. There are two separate things you could be counting:

- **A position** is a single board state — where every piece is, right now.
- **A game** is an entire sequence of moves from the start to some ending point.

Many different move sequences can arrive at the exact same position — so the number of possible *games* is vastly larger than the number of possible *positions*. Mixing these two up is the single most common mistake in "how many chess games" explainers online.

## The exact numbers, move by move

Here's where it stops being an estimate and starts being exact. These are counts of every legal move sequence of a given length (known as "perft" numbers in chess programming), and the number of distinct positions they reach:

| Half-moves (plies) | Possible move sequences | Possible positions |
|---|---|---|
| 1 | 20 | 20 |
| 2 | 400 | 400 |
| 3 | 8,902 | 5,362 |
| 4 | 197,281 | 72,078 |
| 5 | 4,865,609 | 822,518 |
| 6 | 119,060,324 | 9,417,681 |
| 10 | 69,352,859,712,417 | 85,375,278,064 |

Read that last row again: after just **five full moves by each player**, there are already more than **69 trillion** possible move sequences. Chess doesn't feel explosive at move 5 — it looks like an ordinary opening — but the combinatorics underneath are already staggering.

## Where 10^120 actually comes from

Claude Shannon, the founder of information theory, needed a rough size for chess's "game tree" in his 1950 paper "Programming a Computer for Playing Chess" (*Philosophical Magazine*). He argued that no computer could check every possibility. His estimate: about 10^3 (roughly a thousand) possibilities for a pair of moves, one by White and one by Black, and a typical game lasting about 40 such pairs. That gives (10^3)^40 = **10^120**.

It's important to be honest about what this number is: Shannon's own back-of-envelope figure for typical games, which he described as a lower bound. It is not an exact count. Some popular write-ups reconstruct it as roughly 30 moves per position over 80 half-moves (30^80, about 10^118), which gives the same order of magnitude but is not Shannon's own arithmetic.

## How many legal positions actually exist

This is a genuinely different question, and it has a better-supported answer. In 2021, John Tromp estimated the number of legal chess positions at about **4.8 × 10^44** (4.82 with an uncertainty of about ±0.03 × 10^44 at 95% confidence). He did not count them one by one. He sampled random positions and, with Peter Österlund's Texel engine code and help from others, determined for each sample whether it was legal by finding either a game that reaches it or a proof that none exists. The sampling results were then scaled up. Even at "only" 10^44, the number is far beyond brute force, which is why modern engines rely on evaluation and selective search instead of checking everything.

## Why this actually matters, beyond trivia

This math is the entire reason chess engines work the way they do. No computer, now or in any realistic future, checks every possible game — that's precisely Shannon's point, dressed up as a numbers problem. Instead, engines like the ones powering [chess AI opponents today](/blog/how-chess-ai-engines-work) search selectively, pruning away branches that look clearly bad and spending their computation on positions that matter. The sheer size of these numbers is the reason chess remains a rich, unsolved game — and, more practically, why even a well-designed AI engine still has to guess intelligently rather than calculate perfectly.

## Frequently asked questions

**What is the Shannon number in chess?**
The Shannon number is the widely cited estimate of roughly 10^120 possible chess games, calculated by Claude Shannon in 1950 as a rough lower bound based on typical move counts — it's a scale marker for chess's complexity, not an exact count.

**Are there more possible chess games than atoms in the universe?**
Yes, by an enormous margin. There are an estimated 10^80 atoms in the observable universe, while the Shannon number estimate for possible chess games is around 10^120 — chess's complexity outstrips the physical universe's atom count by roughly 40 orders of magnitude.

**Has anyone actually counted every legal chess position?**
Not exhaustively enumerated one by one, but researchers have calculated a very precise estimate — about 4.82 × 10^44 legal positions — using mathematical techniques that don't require checking each one individually.

**Will a computer ever solve chess completely, the way it solved checkers?**
Not with current or foreseeable technology. Checkers has roughly 5 × 10^20 positions, already at the edge of what took years of dedicated computing to fully solve; chess's position count is roughly 24 orders of magnitude larger, putting a full solution far beyond realistic computing power for the foreseeable future.

Want to add a few more branches to that game tree yourself? [Play a game](/play/ai) and see how quickly your own choices multiply the possibilities.
