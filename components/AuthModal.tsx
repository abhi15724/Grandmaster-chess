'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetAndClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setSignupSuccessMsg(null);
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignupSuccessMsg(null);

    if (!email.trim() || !password) {
      setError('Please enter an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await signUp(email.trim(), password, name.trim());
        if (signUpError) {
          setError(signUpError);
        } else {
          setSignupSuccessMsg('Account created! If email confirmation is required, check your inbox — otherwise you are already signed in.');
        }
      } else {
        const { error: signInError } = await signIn(email.trim(), password);
        if (signInError) {
          setError(signInError);
        } else {
          resetAndClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-[#3c3934] bg-[#262421] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100">
            {mode === 'login' ? 'Log In' : 'Create Your Account'}
          </h2>
          <button
            onClick={resetAndClose}
            className="rounded p-1 text-zinc-400 hover:bg-[#3c3934] hover:text-zinc-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isConfigured && (
          <div className="mb-4 rounded-lg border border-amber-800 bg-amber-950/50 p-2.5 text-[11px] font-semibold text-amber-300">
            Accounts aren&apos;t configured for this deployment yet. Set
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then
            run supabase/schema.sql in your Supabase project.
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-lg border border-[#3c3934] bg-[#161512] p-1">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
              setSignupSuccessMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded py-1.5 text-xs font-bold transition-colors ${
              mode === 'login' ? 'bg-[#81b64c] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            Log In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSignupSuccessMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded py-1.5 text-xs font-bold transition-colors ${
              mode === 'signup' ? 'bg-[#81b64c] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Display Name
              </label>
              <div className="flex items-center gap-2 rounded border border-[#3c3934] bg-[#161512] px-3 py-2">
                <UserIcon className="h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  maxLength={20}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. GrandmasterTiger"
                  className="w-full bg-transparent text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Email
            </label>
            <div className="flex items-center gap-2 rounded border border-[#3c3934] bg-[#161512] px-3 py-2">
              <Mail className="h-3.5 w-3.5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-xs text-zinc-100 focus:outline-none"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <div className="flex items-center gap-2 rounded border border-[#3c3934] bg-[#161512] px-3 py-2">
              <Lock className="h-3.5 w-3.5 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs text-zinc-100 focus:outline-none"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-800 bg-rose-950/60 p-2 text-[11px] font-semibold text-rose-300">
              {error}
            </div>
          )}
          {signupSuccessMsg && (
            <div className="rounded-lg border border-[#81b64c]/50 bg-[#81b64c]/10 p-2 text-[11px] font-semibold text-[#81b64c]">
              {signupSuccessMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isConfigured}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#81b64c] py-2.5 text-xs font-bold text-zinc-950 transition-all hover:bg-[#70a33e] active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'login' ? (
              <LogIn className="h-3.5 w-3.5" />
            ) : (
              <UserPlus className="h-3.5 w-3.5" />
            )}
            <span>{loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}</span>
          </button>

          <button
            type="button"
            onClick={resetAndClose}
            className="text-center text-[11px] font-semibold text-zinc-500 hover:text-zinc-300"
          >
            Continue as Guest instead
          </button>
        </form>
      </div>
    </div>
  );
};
