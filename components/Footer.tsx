'use client';

import React from 'react';
import { Swords, Bot, BookOpen, HelpCircle, Shield, Globe, Award } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
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
                <button onClick={() => navigate('/play/ai/basic')} className="hover:text-[#81b64c] transition-colors">
                  Play vs Basic AI (Beginner)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/play/ai/intermediate')} className="hover:text-[#81b64c] transition-colors">
                  Play vs Intermediate AI (Casual)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/play/ai/advanced')} className="hover:text-[#81b64c] transition-colors">
                  Play vs Advanced AI (Master)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/play/local')} className="hover:text-[#81b64c] transition-colors">
                  Play with Yourself (Local Pass & Play)
                </button>
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
                <button onClick={() => navigate('/learn/chess-rules')} className="hover:text-[#81b64c] transition-colors">
                  Complete FIDE Chess Rules
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/learn/how-to-play-chess')} className="hover:text-[#81b64c] transition-colors">
                  How to Play Chess Step-by-Step
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/learn/chess-openings')} className="hover:text-[#81b64c] transition-colors">
                  Popular Chess Openings Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/learn/chess-strategies')} className="hover:text-[#81b64c] transition-colors">
                  Tactics & Middlegame Strategy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-[#81b64c] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-[#81b64c] transition-colors">
                  Chess Blog & Guides
                </button>
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
            <button onClick={() => navigate('/about')} className="hover:text-[#81b64c] hover:underline">About</button>
            <span>•</span>
            <button onClick={() => navigate('/contact')} className="hover:text-[#81b64c] hover:underline">Contact</button>
            <span>•</span>
            <button onClick={() => navigate('/privacy')} className="hover:text-[#81b64c] hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => navigate('/terms')} className="hover:text-[#81b64c] hover:underline">Terms</button>
            <span>•</span>
            <button onClick={() => navigate('/faq')} className="hover:text-[#81b64c] hover:underline">FAQ</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
