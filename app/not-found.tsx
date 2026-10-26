import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/play/ai', label: 'Play chess vs the computer', note: 'Three difficulty levels, no sign-up' },
  { href: '/play/local', label: 'Play on one device', note: 'Two players, with chess clocks' },
  { href: '/learn/chess-rules', label: 'Learn the rules', note: 'How every piece moves' },
  { href: '/tools', label: 'Free chess tools', note: 'Elo calculator, PGN viewer, coordinates trainer' },
  { href: '/blog', label: 'Read the chess guides', note: 'Rules, ratings, tactics and openings' },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">Error 404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-zinc-100 sm:text-3xl">That page is not on the board</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        The link may be old or mistyped. Here are some places to go instead.
      </p>
      <ul className="mt-6 grid gap-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg border border-[#3c3934] bg-[#1e1c19] px-4 py-3 transition-colors hover:border-[#81b64c]/60"
            >
              <span className="text-sm font-bold text-zinc-100">{l.label}</span>
              <span className="block text-xs text-zinc-500">{l.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
