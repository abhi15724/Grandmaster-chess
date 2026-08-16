import { BoardTheme } from '@/types/chess';

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'wood',
    name: 'Classic Board',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
    highlightSelected: 'rgba(247, 247, 105, 0.65)',
    highlightMove: 'rgba(129, 182, 76, 0.45)',
    highlightCheck: 'rgba(212, 64, 59, 0.85)',
    highlightLastMove: 'rgba(247, 247, 105, 0.4)',
    borderClass: 'border-[#3c3934] shadow-2xl',
    previewColor: '#769656',
  },
  {
    id: 'modern',
    name: 'Modern Emerald',
    lightSquare: '#e2e8f0',
    darkSquare: '#0f766e',
    highlightSelected: 'rgba(56, 189, 248, 0.65)',
    highlightMove: 'rgba(56, 189, 248, 0.4)',
    highlightCheck: 'rgba(244, 63, 94, 0.75)',
    highlightLastMove: 'rgba(45, 212, 191, 0.35)',
    borderClass: 'border-teal-900/40 shadow-teal-950/40',
    previewColor: '#0f766e',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Dark',
    lightSquare: '#3f3f46',
    darkSquare: '#18181b',
    highlightSelected: 'rgba(251, 146, 60, 0.65)',
    highlightMove: 'rgba(251, 146, 60, 0.35)',
    highlightCheck: 'rgba(225, 29, 72, 0.8)',
    highlightLastMove: 'rgba(161, 161, 170, 0.3)',
    borderClass: 'border-zinc-800 shadow-black/80',
    previewColor: '#18181b',
  },
  {
    id: 'cyber',
    name: 'Cyber Glass',
    lightSquare: '#e0f2fe',
    darkSquare: '#0369a1',
    highlightSelected: 'rgba(234, 179, 8, 0.7)',
    highlightMove: 'rgba(234, 179, 8, 0.45)',
    highlightCheck: 'rgba(239, 68, 68, 0.8)',
    highlightLastMove: 'rgba(56, 189, 248, 0.4)',
    borderClass: 'border-sky-900/40 shadow-sky-950/40',
    previewColor: '#0369a1',
  },
];

export const DEFAULT_BOARD_THEME = BOARD_THEMES[0];

