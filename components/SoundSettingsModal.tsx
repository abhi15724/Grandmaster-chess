'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1, Play, Check, X, BellRing, Swords, ShieldAlert, Sparkles, Trophy, Clock } from 'lucide-react';
import { sound } from '@/lib/audio';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({ isOpen, onClose }) => {
  const [enabled, setEnabled] = useState(sound.enabled);
  const [volume, setVolume] = useState(Math.round(sound.volume * 100));

  if (!isOpen) return null;

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playMove();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    sound.setVolume(val / 100);
  };

  const soundPreviews = [
    {
      name: 'Piece Move',
      desc: 'Crisp Staunton wooden board placement',
      icon: Swords,
      play: () => sound.playMove(),
    },
    {
      name: 'Piece Capture',
      desc: 'Deep, punchy two-piece wood collision',
      icon: Sparkles,
      play: () => sound.playCapture(),
    },
    {
      name: 'Check Alert',
      desc: 'Crystal harmonic alert chime',
      icon: BellRing,
      play: () => sound.playCheck(),
    },
    {
      name: 'Castling',
      desc: 'Double rhythmic King & Rook placement',
      icon: ShieldAlert,
      play: () => sound.playCastle(),
    },
    {
      name: 'Pawn Promotion',
      desc: 'Ascending 3-note majestic flourish',
      icon: Sparkles,
      play: () => sound.playPromotion(),
    },
    {
      name: 'Victory / Checkmate',
      desc: 'Triumphant major chord fanfare',
      icon: Trophy,
      play: () => sound.playGameEnd(true),
    },
    {
      name: 'Defeat / Loss',
      desc: 'Gentle minor cadence finish',
      icon: Trophy,
      play: () => sound.playGameEnd(false),
    },
    {
      name: 'Low Time Warning',
      desc: 'Urgent wood tick when < 10 seconds',
      icon: Clock,
      play: () => sound.playClockTick(),
    },
  ];

  return (
    <div
      id="sound-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 animate-in fade-in duration-150"
    >
      <div
        id="sound-settings-modal-content"
        className="relative w-full max-w-md rounded-xl border border-[#3c3934] bg-[#262421] p-5 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3c3934]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#81b64c]/20 text-[#81b64c]">
              <Volume2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Audio & Sound FX Settings</h3>
              <p className="text-[11px] text-zinc-400">Web Audio synthesis for piece moves, captures, and alerts</p>
            </div>
          </div>
          <button
            id="sound-settings-close-btn"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-[#3c3934] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Master Sound FX Switch */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#161512] border border-[#3c3934]">
          <div className="flex items-center gap-2.5">
            {enabled ? (
              <Volume2 className="h-4 w-4 text-[#81b64c]" />
            ) : (
              <VolumeX className="h-4 w-4 text-zinc-500" />
            )}
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Sound Feedback</span>
              <span className="text-[10px] text-zinc-400">Play audio on moves, captures, and check alerts</span>
            </div>
          </div>
          <button
            id="sound-settings-toggle-switch"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-[#81b64c]' : 'bg-[#3c3934]'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="p-3 rounded-lg bg-[#161512] border border-[#3c3934] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Volume1 className="h-3.5 w-3.5 text-zinc-400" />
              Master FX Volume
            </span>
            <span className="font-mono text-[11px] font-bold text-[#81b64c]">{volume}%</span>
          </div>
          <input
            id="sound-volume-range-input"
            type="range"
            min="0"
            max="100"
            value={volume}
            disabled={!enabled}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-[#3c3934] rounded-lg appearance-none cursor-pointer accent-[#81b64c] disabled:opacity-40"
          />
        </div>

        {/* Sound FX Preview Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Interactive Sound FX Preview
            </span>
            <span className="text-[10px] text-zinc-500">Click to preview</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
            {soundPreviews.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.name}
                  id={`preview-sound-${s.name.toLowerCase().replace(/\s+/g, '-')}`}
                  disabled={!enabled}
                  onClick={() => s.play()}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#161512] hover:bg-[#3c3934]/60 border border-[#3c3934] hover:border-[#81b64c]/50 text-left transition-colors group disabled:opacity-40"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Icon className="h-3.5 w-3.5 text-[#81b64c] shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-semibold text-zinc-200 block truncate group-hover:text-[#81b64c]">
                        {s.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 block truncate">{s.desc}</span>
                    </div>
                  </div>
                  <Play className="h-3 w-3 text-zinc-400 group-hover:text-[#81b64c] shrink-0 ml-1" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            id="sound-settings-done-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded bg-[#81b64c] text-zinc-950 hover:bg-[#70a33e] transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
