'use client';

import React from 'react';
import Link from 'next/link';
import { Swords, Bot, BookOpen, HelpCircle, Shield, Globe, Award } from 'lucide-react';

interface FooterProps {
  /** @deprecated links are now real <a href> elements; kept for API compatibility */
  navigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="border-t border-[#3c3934] bg-[#161512] text-zinc-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#3c3934]">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#81b64c] text-zinc-950 font-bold">
                <Swords className="h-4 w-4" />
              </div>
              <span className="text-zinc-100 font-bold tracking-tight text-base">Grandmaster Chess</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              The high-density, ultra-responsive online chess platform. Challenge intelligent AI bots or play locally against yourself.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#81b64c] font-medium">
              <Award className="h-4 w-4 text-[#81b64c]" />
              <span>100% Free • FIDE Standard Rules</span>
            </div>
          </div>

          {/* Game Modes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3 flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-[#81b64c]" /> Play Chess
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/play/ai/basic" className="hover:text-[#81b64c] transition-colors">
                  Play vs Basic AI (Beginner)
                </Link>
              </li>
              <li>
                <Link href="/play/ai/intermediate" className="hover:text-[#81b64c] transition-colors">
                  Play vs Intermediate AI (Casual)
                </Link>
              </li>
              <li>
                <Link href="/play/ai/advanced" className="hover:text-[#81b64c] transition-colors">
                  Play vs Advanced AI (Master)
                </Link>
              </li>
              <li>
                <Link href="/play/local" className="hover:text-[#81b64c] transition-colors">
                  Play with Yourself (Local Pass & Play)
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning & Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#81b64c]" /> Learn & Master
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/learn/chess-rules" className="hover:text-[#81b64c] transition-colors">
                  Complete FIDE Chess Rules
                </Link>
              </li>
              <li>
                <Link href="/blog/chess-rules-complete-beginners-guide" className="hover:text-[#81b64c] transition-colors">
                  How to Play Chess Step-by-Step
                </Link>
              </li>
              <li>
                <Link href="/learn/chess-openings" className="hover:text-[#81b64c] transition-colors">
                  Popular Chess Openings Guide
                </Link>
              </li>
              <li>
                <Link href="/learn/chess-strategies" className="hover:text-[#81b64c] transition-colors">
                  Tactics & Middlegame Strategy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#81b64c] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#81b64c] transition-colors">
                  Chess Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* AI & Discovery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#81b64c]" /> Platform & Specs
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Server-authoritative AI move validation, responsive board rendering, Web Audio sound synthesis, and Supabase-backed player profiles.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="rounded bg-[#211f1c] px-2 py-1 text-zinc-400 hover:text-zinc-200 border border-[#3c3934]">
                Sitemap
              </a>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="rounded bg-[#211f1c] px-2 py-1 text-zinc-400 hover:text-zinc-200 border border-[#3c3934]">
                Robots.txt
              </a>
              <a href="/llms.txt" target="_blank" rel="noreferrer" className="rounded bg-[#211f1c] px-2 py-1 text-zinc-400 hover:text-zinc-200 border border-[#3c3934]">
                llms.txt
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
          <p>© {new Date().getFullYear()} Grandmaster Chess Online. Fast, accessible, and high density.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <Link href="/about" className="hover:text-[#81b64c] hover:underline">About</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#81b64c] hover:underline">Contact</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#81b64c] hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#81b64c] hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#81b64c] hover:underline">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
