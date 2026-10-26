import type { Metadata } from 'next';
import Link from 'next/link';
import { Grid3x3 } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { jsonLdGraph, breadcrumbSchema, faqSchema, personSchema } from '@/lib/json-ld';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';
import { CoordinatesTrainer } from '@/components/tools/CoordinatesTrainer';
import { FILES, isDarkSquare, ROUND_SECONDS } from '@/lib/coordinates';

export const metadata: Metadata = pageMetadata({
  title: 'Chess Coordinates Trainer: Learn Square Names',
  description:
    'Practise naming chess squares from a1 to h8 with a free 30-second challenge, from White or Black. Learn board coordinates to read notation. No sign-up.',
  path: '/tools/chess-coordinates-trainer',
  absoluteTitle: true,
  ogLabel: 'Tools',
});

const FAQ = [
  {
    question: 'What are chess coordinates?',
    answer:
      'Every square has a name made of a file letter (a to h, left to right from White\'s side) and a rank number (1 to 8, from White\'s side up the board). The square in the bottom-left corner from White\'s view is a1.',
  },
  {
    question: 'Why should I learn the coordinates?',
    answer:
      'Chess moves are written with square names, for example Nf3 or e4. Knowing the names lets you read game notation, follow commentary and record your own games without looking at a board.',
  },
  {
    question: 'How do I tell if a square is light or dark?',
    answer:
      'a1 is a dark square. Count the file as a=1, b=2 and so on, add the rank, and if the total is even the square is dark; if it is odd, the square is light. For example, h1 is 8 + 1 = 9, so it is light.',
  },
  {
    question: 'Does it matter which side I practise from?',
    answer:
      'Practising from both sides helps, because in a real game you will often see the board from Black\'s side too. Use the board view option to switch.',
  },
  {
    question: 'Is my score saved?',
    answer:
      'Your best score is saved in this browser only, and nothing is sent to a server.',
  },
];

const EXAMPLES = ['a1', 'h1', 'a8', 'h8', 'e4', 'd5'];

export default function CoordinatesTrainerPage() {
  const graph = jsonLdGraph(
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/tools/chess-coordinates-trainer#app`,
      name: 'Chess Coordinates Trainer',
      url: absoluteUrl('/tools/chess-coordinates-trainer'),
      applicationCategory: 'EducationalApplication',
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
      { name: 'Chess Coordinates Trainer', path: '/tools/chess-coordinates-trainer' },
    ]),
    faqSchema(FAQ)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Grid3x3 className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-100 sm:text-3xl">Chess Coordinates Trainer</h1>
      </div>
      <p className="mb-6 text-sm text-zinc-400">
        Learn the name of every square on the board. A square name appears, and you click that square as fast as you can. Choose a {ROUND_SECONDS}-second
        challenge or untimed practice, and practise from White&apos;s or Black&apos;s side.
      </p>

      <CoordinatesTrainer />

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">How chess coordinates work</h2>
          <p className="mb-2">
            The board has eight columns, called files, labelled {FILES[0]} to {FILES[7]} from left to right as White sees the board, and eight rows, called ranks,
            numbered 1 to 8 from White&apos;s side upward. A square is named file first, then rank, so the square where White&apos;s king starts is e1 and the
            square where Black&apos;s king starts is e8. FIDE&apos;s Laws of Chess and the standard algebraic notation used in game records both use these names.
          </p>
          <p>
            Seen from Black&apos;s side, the board is turned around: the a-file is on the right and rank 1 is at the top. That is why the trainer lets you
            switch the view.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">A quick trick for square colours</h2>
          <p className="mb-3">
            Knowing a square&apos;s colour helps you find it. The bottom-left corner a1 is dark, and each step to a neighbouring square changes the colour.
            Counting files as a=1 to h=8, a square is dark when its file number plus its rank number is even.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full max-w-md border border-[#3c3934] text-left text-xs">
              <thead className="bg-[#262421] text-zinc-300">
                <tr><th className="p-2">Square</th><th className="p-2">File + rank</th><th className="p-2">Colour</th></tr>
              </thead>
              <tbody>
                {EXAMPLES.map((sq) => {
                  const total = sq.charCodeAt(0) - 96 + Number(sq[1]);
                  return (
                    <tr key={sq} className="border-t border-[#3c3934]">
                      <td className="p-2 font-semibold text-zinc-100">{sq}</td>
                      <td className="p-2">{sq.charCodeAt(0) - 96} + {sq[1]} = {total}</td>
                      <td className="p-2">{isDarkSquare(sq) ? 'Dark' : 'Light'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-zinc-100">Tips for learning faster</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Start with the coordinates shown on the board, then switch them off once you feel comfortable.</li>
            <li>Learn the four corners first (a1, h1, a8, h8), then the centre squares d4, e4, d5 and e5.</li>
            <li>Practise from both sides, a few minutes at a time, rather than one long session.</li>
            <li>Read a few moves in{' '}<Link href="/blog/chess-notation-explained" className="text-[#81b64c] hover:underline">chess notation</Link>{' '}as you go, and replay them in the{' '}<Link href="/tools/pgn-viewer" className="text-[#81b64c] hover:underline">PGN viewer</Link>.</li>
          </ul>
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
          <h2 className="mb-2 text-lg font-bold text-zinc-100">Sources</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><a href="https://rcc.fide.com/fide-laws-of-chess_fulltexthtml/" target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">FIDE Laws of Chess</a> (in force from 1 January 2023): the chessboard and algebraic notation.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
