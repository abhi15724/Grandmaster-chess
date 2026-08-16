import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These are safe to expose to the browser: the Supabase URL and the
// "publishable" (anon) key are meant to be public and are protected by
// Row Level Security policies on the database side, not by secrecy.
// Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in your
// environment to override these defaults for a different project.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krjfadvplhqoaabejuqd.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_6hxT4ICSY1UBPfos886jqA_VqntdMwl';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'grandmaster_chess_auth',
      },
    });
  }
  return client;
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
