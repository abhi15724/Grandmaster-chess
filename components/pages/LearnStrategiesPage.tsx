'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Target, Zap, Shield, Sparkles, ChevronRight, BookOpen } from 'lucide-react';

interface LearnStrategiesPageProps {
  navigate?: (path: string) => void;
}

export const LearnStrategiesPage: React.FC<LearnStrategiesPageProps> = ({}) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const tactics = [
    {
      title: '1. The Fork',
      icon: Zap,
      desc: 'A single piece attacks two or more enemy pieces at the same time. Knights and Pawns are the most notorious forkers because they can attack more valuable pieces (like Kings and Queens) without being captured in return.',
      tip: 'Look for undefended or loosely guarded enemy pieces on the same color squares as your Knight.',
    },
    {
      title: '2. The Pin',
      icon: Target,
      desc: 'An attacking piece (Bishop, Rook, or Queen) restricts an enemy piece from moving because doing so would expose a more valuable piece (such as the King or Queen) behind it.',
      tip: 'An "Absolute Pin" involves the King, making it physically illegal to move the pinned piece.',
    },
    {
      title: '3. The Skewer',
      icon: Shield,
      desc: 'Often called a "reverse pin": a valuable piece (like a King or Queen) is in direct line of attack. When it moves out of danger, the less valuable piece behind it is left exposed to capture.',
      tip: 'Rooks and Bishops on long files and open diagonals excel at skewers in the endgame.',
    },
    {
      title: '4. Discovered Attack & Check',
      icon: Sparkles,
      desc: 'Moving one piece unmasks a devastating attack from a different piece stationed behind it. When the revealed attack checks the King, it is a Discovered Check.',
      tip: 'Double checks (where both the moving piece and the unmasked piece check the King simultaneously) force the King to move.',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-5 lg:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#81b64c]/40 bg-[#81b64c]/10 px-3 py-1 text-xs font-bold text-[#81b64c] mb-2.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Chess Masterclass</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          Chess Tactics & Strategic Principles
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Master the four foundational tactical motifs and strategic golden rules used by masters to dominate chess games.
        </p>
      </div>

      {/* 4 Essential Tactics */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-zinc-100">Four Foundational Tactical Motifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tactics.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="p-4 rounded-xl bg-[#262421] border border-[#3c3934] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-[#81b64c]/10 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c]">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-100">{t.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">{t.desc}</p>
                </div>
                <div className="text-[11px] text-[#81b64c] bg-[#161512] p-2 rounded border border-[#3c3934]">
                  <strong>Master Tip:</strong> {t.tip}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Golden Strategic Rules */}
      <section className="p-5 sm:p-6 rounded-xl bg-[#262421] border border-[#3c3934] space-y-4">
        <h2 className="text-base font-bold text-zinc-100">
          The 3 Golden Rules of Positional Chess
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#81b64c]">1. Control the Center</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              The four center squares (d4, d5, e4, e5) dictate board mobility. Pieces in the center can reach both wings in fewer moves than pieces trapped on the rim.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#81b64c]">2. King Safety First</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Castle within the first 7–10 moves. Never initiate an aggressive flank assault while your own King is still stranded on an open central e-file.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#81b64c]">3. Activate All Pieces</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Develop Knights and Bishops before making multi-pawn moves or launching premature Queen attacks. Connect your rooks by clearing the back rank.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => navigate('/play/ai')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-[#70a33e] transition-colors shadow-md"
          >
            <span>Test Strategies Against AI</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
