import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';
import { AUTHOR_NAME, CONTACT_EMAIL } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Editorial Policy',
  description:
    'How Grandmasterchess researches, sources, checks, updates and corrects its chess articles, and how we use AI tools.',
  path: '/editorial-policy',
});

const LAST_UPDATED = 'October 23, 2026';

export default function EditorialPolicyPage() {
  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Editorial Policy', path: '/editorial-policy' },
    ])
  );
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <BookOpenCheck className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Editorial Policy</h1>
      </div>
      <p className="text-xs text-zinc-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">What we publish</h2>
          <p>
            Articles that answer one specific question about chess: rules, ratings, tactics, openings, and the people and numbers around the game.
            We do not publish pages just to target keyword variations, and we remove or merge pages that do not offer something useful on their own.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Who is responsible</h2>
          <p>
            Every article is published under the name of its accountable author, {AUTHOR_NAME}, who also runs the site (see the{' '}
            <Link href="/about#author" className="text-[#81b64c] hover:underline">About page</Link>). We do not invent authors, titles, credentials or
            testimonials.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Sources and fact-checking</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ratings, rankings and results are taken from FIDE or the event organiser, and the article states the rating list or date it used.</li>
            <li>Rules are checked against the FIDE Laws of Chess. Rule diagrams are generated from real positions that are validated by a chess library at build time.</li>
            <li>Mathematical claims (for example game counts) cite the original paper or calculation.</li>
            <li>Articles with checked facts list their sources at the bottom and show a &quot;checked on&quot; date. We only show that date after we have actually compared the article with those sources.</li>
            <li>Prices, valuations and records are labelled as verified sales, estimates or reports, and we say when a figure cannot be confirmed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Use of AI tools</h2>
          <p>
            AI tools may help with research, outlining, drafting and editing. AI output is never published as it is: every factual claim must be
            checked against a source, and text that cannot be verified is removed. Articles whose facts have not yet been verified are kept out of
            search results until they have.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Updates</h2>
          <p>
            Time-sensitive pages (rankings, match schedules, platform comparisons) are re-checked when the underlying data changes, and their date is
            updated only when we have made a real change. A page that is out of date is revised or taken down rather than left as it is.
          </p>
        </section>

        <section id="corrections" className="scroll-mt-20">
          <h2 className="text-base font-bold text-zinc-100 mb-2">Corrections</h2>
          <p>
            If you find an error, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#81b64c] hover:underline break-all">{CONTACT_EMAIL}</a> with the page URL and, if
            possible, a source. We will check it and correct the article. Significant corrections are noted on the page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Advertising and independence</h2>
          <p>
            Advertising, if shown, is provided by Google AdSense and does not influence what we write. We do not accept payment for reviews or
            rankings. Articles about other chess platforms are our own assessment based on what we could verify.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Health-related content</h2>
          <p>
            Articles about chess and wellbeing are general information, not medical advice. They describe what published research does and does not
            show and should not replace advice from a qualified professional.
          </p>
        </section>
      </div>
    </div>
  );
}
