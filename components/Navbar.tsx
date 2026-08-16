'use client';

import React, { useState, useEffect } from 'react';
import { Swords, Bot, Monitor, BookOpen, HelpCircle, Trophy, Volume2, VolumeX, Menu, X, Shield, Settings2, Newspaper, LogIn, LogOut } from 'lucide-react';
import { sound } from '@/lib/audio';
import { SoundSettingsModal } from '@/components/SoundSettingsModal';
import { getStoredUserStats, STATS_UPDATED_EVENT } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [soundOn, setSoundOn] = useState(sound.enabled);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState(getStoredUserStats());
  const { user, loading: authLoading, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    const handleStatsUpdate = () => setUserStats(getStoredUserStats());
    window.addEventListener('storage', handleStatsUpdate);
    window.addEventListener(STATS_UPDATED_EVENT, handleStatsUpdate);
    const interval = setInterval(handleStatsUpdate, 3000);
    return () => {
      window.removeEventListener('storage', handleStatsUpdate);
      window.removeEventListener(STATS_UPDATED_EVENT, handleStatsUpdate);
      clearInterval(interval);
    };
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setEnabled(next);
    if (next) sound.playMove();
  };

  const navLinks = [
    { label: 'Play AI', path: '/play/ai', icon: Bot },
    { label: 'Local Chess', path: '/play/local', icon: Monitor },
    { label: 'Rules & Openings', path: '/learn/chess-rules', icon: BookOpen },
    { label: 'Blog', path: '/blog', icon: Newspaper },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
    { label: 'Dashboard', path: '/dashboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3c3934] bg-[#262421]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => {
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950 font-extrabold shadow-sm group-hover:bg-[#70a33e] transition-colors">
            <Swords className="h-5 w-5 text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-zinc-100 text-base leading-tight">
              <span>Grandmaster</span>
              <span className="text-[#81b64c] font-extrabold">Chess</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Play vs AI or Yourself</span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            return (
              <button
                key={item.path}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#3c3934] text-[#81b64c] shadow-sm'
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-[#3c3934]/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5 opacity-90" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Sound, Rating Pill, Mobile Menu */}
        <div className="flex items-center gap-2">
          
          {/* Sound Controls */}
          <div className="flex items-center rounded-md border border-[#3c3934] bg-[#211f1c] p-0.5">
            <button
              id="nav-sound-toggle-btn"
              aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
              onClick={toggleSound}
              className="flex h-7 w-7 items-center justify-center rounded text-zinc-300 hover:text-zinc-100 hover:bg-[#3c3934]/60 transition-colors"
              title={soundOn ? 'Sound On (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5 text-[#81b64c]" /> : <VolumeX className="h-3.5 w-3.5 text-zinc-500" />}
            </button>
            <button
              id="nav-sound-settings-open-btn"
              aria-label="Open Sound Effects Settings"
              onClick={() => setIsSoundModalOpen(true)}
              className="flex h-7 px-1.5 items-center justify-center text-[10px] font-bold text-zinc-400 hover:text-zinc-100 hover:bg-[#3c3934]/60 rounded border-l border-[#3c3934] transition-colors"
              title="Sound FX Settings & Volume"
            >
              FX
            </button>
          </div>

          {/* User Rating Badge */}
          <button
            id="nav-user-profile-badge"
            onClick={() => navigate('/dashboard')}
            className="hidden xl:flex items-center gap-1.5 rounded-md border border-[#3c3934] bg-[#211f1c] px-2.5 py-1 text-xs font-semibold text-zinc-200 hover:border-[#81b64c]/60 transition-colors"
            title="View Player Rating & Stats"
          >
            <Shield className="h-3.5 w-3.5 text-[#81b64c]" />
            <span>{userStats.name}</span>
            <span className="font-mono-chess rounded bg-[#81b64c]/20 px-1.5 py-0.5 text-[#81b64c] text-[11px] font-bold">
              {userStats.rating}
            </span>
          </button>

          {/* Account: Login/Signup or Logout */}
          {!authLoading && (
            user ? (
              <button
                id="nav-logout-btn"
                onClick={() => signOut()}
                className="hidden xl:flex items-center gap-1.5 rounded-md border border-[#3c3934] bg-[#211f1c] px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:border-rose-500/60 transition-colors"
                title={user.email || 'Log out'}
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                id="nav-login-btn"
                onClick={openAuthModal}
                className="hidden xl:flex items-center gap-1.5 rounded-md border border-[#81b64c]/50 bg-[#81b64c]/10 px-2.5 py-1.5 text-xs font-bold text-[#81b64c] hover:bg-[#81b64c]/20 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Log In / Sign Up</span>
              </button>
            )
          )}

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-menu-btn"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex xl:hidden h-8 w-8 items-center justify-center rounded-md border border-[#3c3934] bg-[#211f1c] text-zinc-300 hover:text-zinc-100"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#3c3934] bg-[#262421] px-4 py-3 shadow-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#3c3934] text-[#81b64c]'
                      : 'text-zinc-300 hover:bg-[#3c3934]/50'
                  }`}
                >
                  <Icon className="h-4 w-4 opacity-90" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="mt-2 border-t border-[#3c3934] pt-2 flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setIsSoundModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md bg-[#211f1c] px-3 py-2 text-xs text-zinc-300 border border-[#3c3934] hover:border-[#81b64c]/60"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Volume2 className="h-3.5 w-3.5 text-[#81b64c]" />
                  <span>Audio & Sound FX Settings</span>
                </span>
                <span className="text-[11px] font-bold text-zinc-400">
                  {soundOn ? `${Math.round(sound.volume * 100)}%` : 'Muted'}
                </span>
              </button>

              <button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md bg-[#211f1c] px-3 py-2 text-xs text-zinc-300 border border-[#3c3934]"
              >
                <span>{user ? 'Playing as' : 'Guest'}: <strong>{userStats.name}</strong></span>
                <span className="font-mono-chess rounded bg-[#81b64c]/20 px-2 py-0.5 font-bold text-[#81b64c]">
                  {userStats.rating}
                </span>
              </button>

              {!authLoading && (
                user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md bg-[#211f1c] px-3 py-2 text-xs font-semibold text-zinc-300 border border-[#3c3934] hover:border-rose-500/60"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-400" />
                    <span>Log Out ({user.email})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md bg-[#81b64c]/10 px-3 py-2 text-xs font-bold text-[#81b64c] border border-[#81b64c]/40"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Log In / Sign Up</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Sound Settings Modal */}
      <SoundSettingsModal
        isOpen={isSoundModalOpen}
        onClose={() => {
          setIsSoundModalOpen(false);
          setSoundOn(sound.enabled);
        }}
      />
    </header>
  );
};
