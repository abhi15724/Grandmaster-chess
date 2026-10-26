import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { jsonLdGraph, breadcrumbSchema, faqSchema, personSchema } from '@/lib/json-ld';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';
import { EloCalculator } from '@/components/tools/EloCalculator';

export const metadata: Metadata = pageMetadata({
  title: 'Elo Rating Calculator for Chess',
  description:
    'Free chess Elo calculator: enter your rating, your opponents and the results to see your expected score and new rating. Includes FIDE K-factors and worked examples.',
  path: '/tools/elo-calculator',
  ogLabel: 'Tools',
});

const FAQ = [
  {
    question: 'How is a chess Elo rating change calculated?',
    answer:
      'The change is K × (actual score − expected score). The expected score comes from the rating gap between you and your opponent; the actual score is 1 for a win, 0.5 for a draw and 0 for a loss. K is a constant that controls how fast ratings move.',
  },
  {
    question: 'What K-factor should I use?',
    answer:
      'FIDE uses a larger K for new and young players and a smaller K for established and top players (40 for new players and for under-18s rated below 2300, 20 while rated below 2400, and 10 once a rating has reached 2400). Online sites and clubs choose their own values, and many online sites use Glicko-style systems that work differently, so use the Custom option for those.',
  },
  {
    question: 'Will this match my official FIDE rating change exactly?',
    answer:
      'It will be very close but not always identical. FIDE reads expected scores from a published conversion table rather than the formula used here, and rounds results differently. Use FIDE\'s own calculator to confirm an official figure.',
  },
  {
    question: 'Why do I gain so little for beating a much lower-rated player?',
    answer:
      'Because you were expected to win. If your expected score is 0.91, a win earns only 0.09 × K points, while a loss costs 0.91 × K.',
  },
];

const GAP_ROWS = [0, 100, 200, 300, 400].map((gap) => ({
  gap,
  expected: 1 / (1 + Math.pow(10, -gap / 400)),
}));

export default function EloCalculatorPage() {
  const graph = jsonLdGraph(
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/tools/elo-calculator#app`,
      name: 'Chess Elo Rating Calculator',
      url: absoluteUrl('/tools/elo-calculator'),
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
      { name: 'Elo Rating Calculator', path: '/tools/elo-calculator' },
    ]),
    faqSchema(FAQ)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Calculator className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Chess Elo Rating Calculator</h1>
      </div>
      <p className="text-sm text-zinc-400 mb-6">
        Enter your rating, the opponents you played and the results. The calculator shows your expected score and your new rating. Nothing you enter
        leaves your browser.
      </p>

      <EloCalculator />

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
        <section>
          <h2 className="text-lg font-bold text-zinc-100 mb-2">The formula</h2>
          <p className="mb-2">
            The Elo system predicts how many points a player should score. For a player rated <em>R</em> facing an opponent rated <em>O</em>, the
            expected score is <code className="rounded bg-[#262421] px-1.5 py-0.5 text-[#81b64c]">E = 1 / (1 + 10^((O − R) / 400))</code>. After the
            game, the new rating is <code className="rounded bg-[#262421] px-1.5 py-0.5 text-[#81b64c]">R + K × (S − E)</code>, where S is 1 for a win,
            0.5 for a draw and 0 for a loss.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#3c3934]">
              <caption className="p-2 text-left text-zinc-400">Expected score of the higher-rated player, by rating gap</caption>
              <thead className="bg-[#262421] text-zinc-300">
                <tr><th className="p-2">Rating gap</th><th className="p-2">Higher-rated player expects</th><th className="p-2">Lower-rated player expects</th></tr>
              </thead>
              <tbody>
                {GAP_ROWS.map((r) => (
                  <tr key={r.gap} className="border-t border-[#3c3934]">
                    <td className="p-2">{r.gap}</td>
                    <td className="p-2">{(r.expected * 100).toFixed(0)}%</td>
                    <td className="p-2">{((1 - r.expected) * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-100 mb-2">A worked example</h2>
          <p>
            You are rated 1500 and play an opponent rated 1700, with K = 20. The gap is 200, so your expected score is 0.24. A win gives you
            20 × (1 − 0.24) = <strong className="text-zinc-100">+15.2</strong> points. A draw gives 20 × (0.5 − 0.24) ={' '}
            <strong className="text-zinc-100">+5.2</strong>. A loss costs 20 × (0 − 0.24) = <strong className="text-zinc-100">−4.8</strong>. Try it
            above: the first row is pre-filled with the win case.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-100 mb-2">Assumptions and limits</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>This uses the standard logistic Elo formula. FIDE publishes a conversion table that gives almost the same expected scores (about 0.92 rather than 0.91 at a 400-point gap), so an official result can differ by a fraction of a point.</li>
            <li>FIDE counts rating gaps above 400 as 400, which is what the ticked box does. The Handbook (B.02) has the full conditions and any exceptions.</li>
            <li>Several games are all rated from your starting rating, as in one rating period. Updating after every game, as many websites do, gives slightly different totals.</li>
            <li>Chess websites often use Glicko or similar systems, and your site rating is not comparable to a FIDE rating. See <Link href="/blog/how-to-get-a-chess-rating" className="text-[#81b64c] hover:underline">how to get an official chess rating</Link> and our <Link href="/blog/chess-rating-elo-explained" className="text-[#81b64c] hover:underline">explanation of Elo ratings</Link>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-100 mb-3">Frequently asked questions</h2>
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
          <h2 className="text-lg font-bold text-zinc-100 mb-2">Sources</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><a href="https://handbook.fide.com/chapter/B022024" target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">FIDE Handbook, B.02 Rating Regulations (effective 1 March 2024)</a>: K-factors, the 400-point rule and the conversion table.</li>
            <li><a href="https://ratings.fide.com/calc.phtml?page=change" target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">FIDE rating change calculator</a>: use it to confirm an official figure.</li>
            <li>Arpad Elo, <em>The Rating of Chessplayers, Past and Present</em> (1978): the original description of the system.</li>
          </ul>
          <p className="mt-2 text-xs text-zinc-500">Calculator and text by <Link href="/about#author" className="underline hover:text-[#81b64c]">Grandmasterchess</Link>. Checked against the FIDE sources above on October 23, 2026.</p>
        </section>
      </div>
    </div>
  );
}
