import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftRight, Calculator, FileText, Files, Grid3x3, Landmark, Wrench } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { jsonLdGraph, breadcrumbSchema, personSchema } from '@/lib/json-ld';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Free Chess Tools',
  description:
    'Free tools that run in your browser: chess tools (Elo calculator, PGN viewer, coordinates trainer) plus a currency converter, EMI calculator and PDF converters.',
  path: '/tools',
  ogLabel: 'Tools',
});

const CHESS_TOOLS = [
  {
    href: '/tools/elo-calculator',
    name: 'Elo Rating Calculator',
    icon: Calculator,
    text: 'Enter your rating, your opponents and the results to see your expected score and new rating, with FIDE K-factors.',
  },
  {
    href: '/tools/pgn-viewer',
    name: 'PGN Viewer',
    icon: FileText,
    text: 'Paste a PGN or FEN and replay a chess game move by move. Copy the FEN of any position.',
  },
  {
    href: '/tools/chess-coordinates-trainer',
    name: 'Chess Coordinates Trainer',
    icon: Grid3x3,
    text: 'Learn the name of every square with a 30-second challenge, from White or Black.',
  },
];

const EVERYDAY_TOOLS = [
  { href: '/tools/currency-converter', name: 'Currency Converter', icon: ArrowLeftRight, text: 'Convert between about 30 major currencies using daily European Central Bank reference rates.' },
  { href: '/tools/emi-calculator', name: 'EMI Calculator', icon: Landmark, text: 'Work out the monthly payment, total interest and repayment schedule for a loan.' },
  { href: '/tools/pdf-converter', name: 'PDF Converters', icon: Files, text: 'Convert images to PDF, PDF to Word, and more. Several run entirely in your browser.' },
];
const TOOLS = [...CHESS_TOOLS, ...EVERYDAY_TOOLS];

export default function ToolsPage() {
  const graph = jsonLdGraph(
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/tools#page`,
      name: 'Free Chess Tools',
      url: absoluteUrl('/tools'),
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: absoluteUrl(t.href) })),
      },
    },
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
    ])
  );
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Wrench className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-100 sm:text-3xl">Free Chess Tools</h1>
      </div>
      <p className="mb-6 text-sm text-zinc-400">
        Free tools that need no account. The chess tools and most everyday tools run in your browser and do not upload what you enter.
      </p>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-500">Chess tools</h2>
      <ul className="mb-8 grid gap-3">
        {CHESS_TOOLS.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="flex gap-4 rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 transition-colors hover:border-[#81b64c]/60">
              <t.icon className="mt-0.5 h-6 w-6 shrink-0 text-[#81b64c]" />
              <span>
                <span className="block text-base font-bold text-zinc-100">{t.name}</span>
                <span className="mt-1 block text-sm text-zinc-400">{t.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-500">Everyday tools</h2>
      <ul className="grid gap-3">
        {EVERYDAY_TOOLS.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="flex gap-4 rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 transition-colors hover:border-[#81b64c]/60">
              <t.icon className="mt-0.5 h-6 w-6 shrink-0 text-[#81b64c]" />
              <span>
                <span className="block text-base font-bold text-zinc-100">{t.name}</span>
                <span className="mt-1 block text-sm text-zinc-400">{t.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-zinc-400">
        Want to play instead? <Link href="/play/ai" className="text-[#81b64c] hover:underline">Play the computer</Link> or{' '}
        <Link href="/play/local" className="text-[#81b64c] hover:underline">play on one device</Link>.
      </p>
    </div>
  );
}
