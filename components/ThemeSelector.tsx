'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { BoardTheme } from '@/types/chess';
import { BOARD_THEMES } from '@/lib/chess/themes';

interface ThemeSelectorProps {
  currentTheme: BoardTheme;
  onSelectTheme: (theme: BoardTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Palette className="h-3.5 w-3.5 text-zinc-400" />
      <div className="flex items-center gap-1 bg-[#211f1c] border border-[#3c3934] rounded-lg p-0.5">
        {BOARD_THEMES.map((th) => {
          const isSelected = th.id === currentTheme.id;
          return (
            <button
              key={th.id}
              onClick={() => onSelectTheme(th)}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded transition-all ${
                isSelected
                  ? 'bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/50 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#3c3934]'
              }`}
              title={`Switch to ${th.name}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border border-zinc-700 shadow-xs"
                style={{ backgroundColor: th.previewColor }}
              />
              <span className="hidden sm:inline text-[11px]">{th.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

