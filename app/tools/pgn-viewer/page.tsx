import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { jsonLdGraph, breadcrumbSchema, faqSchema, personSchema } from '@/lib/json-ld';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';
import { PgnViewer } from '@/components/tools/PgnViewer';

export const metadata: Metadata = pageMetadata({
  title: 'Free PGN Viewer: Replay Chess Games Online',
  description:
    'Paste a PGN or FEN and replay any chess game move by move on a board. Free, runs in your browser, no sign-up, and shows the FEN of every position.',
  path: '/tools/pgn-viewer',
  ogLabel: 'Tools',
});

const FAQ = [
  {
    question: 'What is a PGN file?',
    answer:
      'PGN (Portable Game Notation) is a plain-text format for recording a chess game. It starts with tag pairs such as the event, the players and the result, followed by the moves in standard algebraic notation.',
  },
  {
    question: 'How do I view a PGN online?',
    answer:
      'Paste the PGN into the box above. The board shows the starting position, and you can step through the moves with the buttons, the arrow keys, or by clicking any move in the list.',
  },
  {
    question: 'Can I paste a FEN instead of a game?',
    answer:
      'Yes. A FEN describes a single position, so the viewer shows that position with no moves to step through. It also works the other way: step to any position in a game and copy its FEN.',
  },
  {
    question: 'Is my game uploaded anywhere?',
    answer:
      'No. The viewer runs in your browser and does not send what you paste to a server.',
  },
  {
    question: 'What does the viewer not support?',
    answer:
      'It shows the first game when several are pasted, ignores comments and variations, and supports standard chess only (not chess variants).',
  },
];

const FEN_FIELDS = [
  ['1. Piece placement', 'Ranks 8 to 1, separated by slashes. Letters are pieces (capitals for White), digits count empty squares.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'],
  ['2. Active colour', 'Whose turn it is: w or b.', 'w'],
  ['3. Castling rights', 'K and Q for White kingside and queenside, k and q for Black, or - for none.', 'KQkq'],
  ['4. En passant square', 'The square a pawn can be captured on en passant this move, or -.', '-'],
  ['5. Halfmove clock', 'Moves since the last pawn move or capture, used for the fifty-move rule.', '0'],
  ['6. Fullmove number', 'Starts at 1 and increases after Black moves.', '1'],
];

export default function PgnViewerPage() {
  const graph = jsonLdGraph(
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/tools/pgn-viewer#app`,
      name: 'PGN Viewer',
      url: absoluteUrl('/tools/pgn-viewer'),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@id': `${SITE_URL}/#author` },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: 'PGN Viewer', path: '/tools/pgn-viewer' },
    ]),
    faqSchema(FAQ)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <FileText className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-100 sm:text-3xl">Free PGN Viewer: Replay Chess Games Online</h1>
      </div>
      <p className="mb-6 text-sm text-zinc-400">
        Paste the moves of a chess game and step through it on a board. The sample below is the Opera Game, played by Paul Morphy in Paris in 1858.
        Everything runs in your browser, so nothing you paste is uploaded.
      </p>

      <PgnViewer />

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">How to use the viewer</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Copy a game&apos;s PGN from a chess website, a database or your own games. On Grandmasterchess, the move list beside a game has copy and download buttons for PGN.</li>
            <li>Paste it into the box. The board resets to the starting position.</li>
            <li>Step with the arrow buttons or your keyboard&apos;s left and right arrows, press play to watch the game, or click a move to jump to it.</li>
            <li>Use <strong className="text-zinc-100">Flip board</strong> to see the game from Black&apos;s side, and copy the position&apos;s FEN to open it in any other chess tool.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">What is a PGN?</h2>
          <p className="mb-2">
            Portable Game Notation is a standard plain-text format for recording chess games, devised around 1993 by Steven J. Edwards. A PGN begins
            with &quot;tag pairs&quot; in square brackets, such as <code className="rounded bg-[#262421] px-1 text-[#81b64c]">[White &quot;Paul Morphy&quot;]</code>.
            Archival PGN requires seven of them, called the Seven Tag Roster: Event, Site, Date, Round, White, Black and Result. The moves follow in
            standard algebraic notation. If you are not sure how to read them, see our guide to{' '}
            <Link href="/blog/chess-notation-explained" className="text-[#81b64c] hover:underline">chess notation</Link>.
          </p>
          <p>
            A PGN can also start from a position other than the usual one by including a FEN tag, and this viewer honours it.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">What is a FEN?</h2>
          <p className="mb-3">
            Forsyth-Edwards Notation describes one position on a single line of six fields. Here is the starting position, field by field:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-[#3c3934] text-left text-xs">
              <thead className="bg-[#262421] text-zinc-300">
                <tr><th className="p-2">Field</th><th className="p-2">Meaning</th><th className="p-2">Start position</th></tr>
              </thead>
              <tbody>
                {FEN_FIELDS.map(([f, m, v]) => (
                  <tr key={f} className="border-t border-[#3c3934] align-top">
                    <td className="p-2 font-semibold text-zinc-100">{f}</td>
                    <td className="p-2">{m}</td>
                    <td className="p-2 font-mono break-all text-zinc-100">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-zinc-100">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.question}>
                <h3 className="font-bold text-zinc-100">{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">Related</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><Link href="/tools/chess-coordinates-trainer" className="text-[#81b64c] hover:underline">Chess coordinates trainer</Link>: learn square names so notation reads quickly.</li>
            <li><Link href="/tools/elo-calculator" className="text-[#81b64c] hover:underline">Elo rating calculator</Link>: work out how a result changes your rating.</li>
            <li><Link href="/play/ai" className="text-[#81b64c] hover:underline">Play a game against the computer</Link> and paste the PGN here afterwards.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">Sources</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><a href="https://opensource.apple.com/source/Chess/Chess-105.0.14/Documentation/PGN-Standard.txt.auto.html" target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">Portable Game Notation Specification and Implementation Guide</a> (Steven J. Edwards, 1994 revision).</li>
            <li><a href="https://en.wikipedia.org/wiki/Portable_Game_Notation" target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">Wikipedia: Portable Game Notation</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Forsyth-Edwards_Notation" target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">Wikipedia: Forsyth-Edwards Notation</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
