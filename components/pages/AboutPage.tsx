'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Bot, Monitor, ShieldCheck, Sparkles, Mail } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Swords className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">About Grandmaster Chess Online</h1>
      </div>
      <p className="text-sm text-zinc-400 mb-8">
        A free, fast, no-login-required chess platform — built for people who just want to play.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">What we're building</h2>
          <p>
            Grandmaster Chess Online (grandmasterchess.in) is a browser-based chess platform offering
            two focused ways to play: challenging a tiered AI opponent, and local pass-and-play chess
            on a single device. The goal is simple — remove every bit of friction between wanting to
            play a game of chess and actually making your first move.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Why it exists</h2>
          <p>
            Most free chess tools force a choice between an AI that's trivially easy or one that's
            effectively unbeatable, with little in between — and many require an account before you
            can play a single move. We built this site to fix both problems: a genuinely tiered AI
            engine across Basic, Intermediate, and Advanced difficulty, and instant play with no
            sign-up wall. An account is entirely optional, only needed if you want your rating and
            game history synced across devices.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">What's under the hood</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-3">
              <Bot className="h-4 w-4 text-[#81b64c] mb-1.5" />
              <p className="text-xs font-bold text-zinc-100">AI Engine</p>
              <p className="text-[11px] text-zinc-400 mt-1">Minimax search with alpha-beta pruning across three difficulty tiers.</p>
            </div>
            <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-3">
              <ShieldCheck className="h-4 w-4 text-[#81b64c] mb-1.5" />
              <p className="text-xs font-bold text-zinc-100">Full FIDE Rules</p>
              <p className="text-[11px] text-zinc-400 mt-1">En passant, castling, promotion, threefold repetition, and stalemate, all enforced.</p>
            </div>
            <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-3">
              <Monitor className="h-4 w-4 text-[#81b64c] mb-1.5" />
              <p className="text-xs font-bold text-zinc-100">Works Everywhere</p>
              <p className="text-[11px] text-zinc-400 mt-1">Responsive, touch-friendly board that works the same on phone, tablet, or desktop.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">Who's behind this</h2>
          <p>
            Grandmaster Chess Online is an independently built and maintained project. We're focused
            on keeping the core experience — playing chess — genuinely good, rather than layering on
            features for their own sake.
          </p>
        </section>

        <section className="pt-2">
          <h2 className="text-base font-bold text-zinc-100 mb-2">Get in touch</h2>
          <p className="mb-3">
            Questions, feedback, or found something broken? We'd like to hear about it.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-4 py-2.5 text-xs font-bold text-zinc-950 hover:bg-[#70a33e] transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact Us
          </button>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-[#3c3934] flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/play/ai')}
          className="flex items-center gap-2 rounded-lg bg-[#262421] border border-[#3c3934] px-4 py-2.5 text-xs font-bold text-zinc-100 hover:border-[#81b64c]/50 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#81b64c]" />
          Play Now
        </button>
      </div>
    </div>
  );
};
