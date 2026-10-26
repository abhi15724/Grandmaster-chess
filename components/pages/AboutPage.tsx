import Link from 'next/link';
import { Swords, Bot, Monitor, ShieldCheck, Mail, BookOpenCheck } from 'lucide-react';
import { AUTHOR_NAME, AUTHOR_ROLE, AUTHOR_BIO } from '@/lib/site-config';

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Swords className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">About Grandmasterchess</h1>
      </div>
      <p className="text-sm text-zinc-400 mb-8">
        A free chess site where you can start a game in one click, plus guides and tools that explain the rules and the numbers behind the game.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">What this site is</h2>
          <p>
            Grandmasterchess (grandmasterchess.in) is an independent, free-to-use chess website. You can play against a computer opponent at three
            difficulty levels or play two-player chess on one device, with chess clocks, a move list and PGN export. No account is needed to play.
            Alongside the games we publish{' '}
            <Link href="/blog" className="text-[#81b64c] hover:underline">chess articles</Link>, a{' '}
            <Link href="/learn/chess-rules" className="text-[#81b64c] hover:underline">rules guide</Link> and small tools such as an{' '}
            <Link href="/tools/elo-calculator" className="text-[#81b64c] hover:underline">Elo rating calculator</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Why it exists</h2>
          <p>
            Many free chess tools make you register before your first move, or offer an opponent that is either far too weak or far too strong.
            This site tries to fix both: instant play, and a difficulty ladder that lets you pick a level that suits you. Our guides aim to answer one
            specific question each, show positions on a board where that helps, and say where their facts come from.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">How the games work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-3">
              <Bot className="h-4 w-4 text-[#81b64c] mb-1.5" />
              <p className="text-xs font-bold text-zinc-100">Our own engine</p>
              <p className="text-[11px] text-zinc-400 mt-1">Minimax search with alpha-beta pruning at three strength levels. It is not Stockfish and it is not a master-strength engine.</p>
            </div>
            <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-3">
              <ShieldCheck className="h-4 w-4 text-[#81b64c] mb-1.5" />
              <p className="text-xs font-bold text-zinc-100">Rules enforced</p>
              <p className="text-[11px] text-zinc-400 mt-1">Castling, en passant, promotion, threefold repetition, the 50-move rule and insufficient-material draws are all handled.</p>
            </div>
            <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-3">
              <Monitor className="h-4 w-4 text-[#81b64c] mb-1.5" />
              <p className="text-xs font-bold text-zinc-100">Phone to desktop</p>
              <p className="text-[11px] text-zinc-400 mt-1">A responsive board with click-to-move and drag-and-drop.</p>
            </div>
          </div>
        </section>

        <section id="author" className="scroll-mt-20">
          <h2 className="text-base font-bold text-zinc-100 mb-2">Who runs it</h2>
          <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4">
            <p className="text-base font-bold text-zinc-100">{AUTHOR_NAME}</p>
            <p className="text-xs text-[#81b64c] font-semibold mb-2">{AUTHOR_ROLE}</p>
            <p>{AUTHOR_BIO}</p>
            <p className="mt-3 text-xs text-zinc-400">
              Based in India. Contact details are on the <Link href="/contact" className="text-[#81b64c] hover:underline">contact page</Link>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">How we keep articles accurate</h2>
          <p className="mb-3">
            Ratings, rankings, prices and match schedules change. We cite primary sources such as FIDE, show the date a figure was checked, and fix
            errors that readers report. The full process is in our{' '}
            <Link href="/editorial-policy" className="text-[#81b64c] hover:underline">editorial policy</Link>.
          </p>
          <Link
            href="/editorial-policy"
            className="inline-flex items-center gap-2 rounded-lg border border-[#3c3934] bg-[#262421] px-4 py-2.5 text-xs font-bold text-zinc-100 hover:border-[#81b64c]/50 transition-colors"
          >
            <BookOpenCheck className="h-3.5 w-3.5 text-[#81b64c]" />
            Read the editorial policy
          </Link>
        </section>

        <section className="pt-2">
          <h2 className="text-base font-bold text-zinc-100 mb-2">Get in touch</h2>
          <p className="mb-3">Found a bug, a factual error, or have an idea? We would like to hear about it.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-4 py-2.5 text-xs font-bold text-zinc-950 hover:bg-[#70a33e] transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact us
          </Link>
        </section>
      </div>
    </div>
  );
};
