import { UserStats, SavedGameSummary } from '@/types/chess';
import { getSupabaseClient } from '@/lib/supabase';

const STATS_STORAGE_KEY = 'grandmaster_chess_user_stats';
const PREFS_STORAGE_KEY = 'grandmaster_chess_user_prefs';
export const STATS_UPDATED_EVENT = 'gc:stats-updated';

function notifyStatsUpdated() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STATS_UPDATED_EVENT));
}

export function getStoredUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return createDefaultStats();
  }
  try {
    // sessionStorage (not localStorage): a guest's name/rating stay stable
    // for the lifetime of one browser tab/session, but a fresh guest
    // identity is minted the next time they open the site. Signed-in
    // users are unaffected — their real profile lives in Supabase and is
    // re-fetched into this cache on every load via loadStatsFromSupabase().
    const raw = sessionStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Guard against malformed/partial data (e.g. from an older app
      // version) silently minting a brand-new guest id every load.
      if (parsed && typeof parsed.id === 'string' && parsed.id.length > 0) {
        return parsed as UserStats;
      }
    }
  } catch {
    // fallback
  }
  const defaultStats = createDefaultStats();
  saveUserStats(defaultStats);
  return defaultStats;
}

function createDefaultStats(): UserStats {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const guestId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `guest_${crypto.randomUUID()}`
      : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  return {
    id: guestId,
    name: `Player_${randomSuffix}`,
    rating: 1200,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    history: [],
  };
}

export function saveUserStats(stats: UserStats, opts: { sync?: boolean } = { sync: true }): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore (e.g. storage disabled/full) — the in-memory value on this
    // page load is still correct, it just won't persist across reloads.
  }
  notifyStatsUpdated();
  if (opts.sync !== false) {
    void syncStatsToSupabase(stats);
  }
}

/**
 * Best-effort push of the current stats to Supabase, only when a logged-in
 * (non-guest) session exists. Fire-and-forget: never throws, never blocks
 * the (synchronous) local save.
 */
async function syncStatsToSupabase(stats: UserStats): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return; // guest — nothing to sync

    await supabase.from('profiles').upsert({
      id: user.id,
      name: stats.name,
      rating: stats.rating,
      games_played: stats.gamesPlayed,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      history: stats.history,
    });
  } catch {
    // Non-fatal: profile sync failing (e.g. `profiles` table not created
    // yet — see supabase/schema.sql) should never break gameplay.
  }
}

/**
 * Pulls the signed-in user's profile row from Supabase and merges it into
 * local storage under that user's id, so getStoredUserStats() (used
 * everywhere, synchronously) picks it up on next read. Called by
 * AuthContext right after sign-in and on session restore.
 */
export async function loadStatsFromSupabase(userId: string, fallbackName?: string): Promise<UserStats | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error || !data) return null;

    const stats: UserStats = {
      id: data.id,
      name: data.name || fallbackName || 'Player',
      rating: data.rating ?? 1200,
      gamesPlayed: data.games_played ?? 0,
      wins: data.wins ?? 0,
      losses: data.losses ?? 0,
      draws: data.draws ?? 0,
      history: Array.isArray(data.history) ? data.history : [],
    };
    saveUserStats(stats, { sync: false });
    return stats;
  } catch {
    return null;
  }
}

export function updateUserName(newName: string): UserStats {
  const stats = getStoredUserStats();
  stats.name = newName.trim();
  saveUserStats(stats);
  return stats;
}

export function resetUserStats(): UserStats {
  const fresh = createDefaultStats();
  saveUserStats(fresh);
  return fresh;
}

export function recordGameResult(
  result: 'win' | 'loss' | 'draw',
  opponentName: string,
  opponentRating: number,
  mode: SavedGameSummary['mode'],
  playerColor: SavedGameSummary['playerColor'],
  reason: string,
  movesCount: number,
  pgn: string,
  fenFinal: string
): UserStats {
  const stats = getStoredUserStats();

  // Simple standard Elo update formula (K-factor = 32)
  const K = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - stats.rating) / 400));
  const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  const ratingDelta = Math.round(K * (actualScore - expectedScore));
  
  stats.rating = Math.max(100, stats.rating + ratingDelta);
  stats.gamesPlayed += 1;
  if (result === 'win') stats.wins += 1;
  else if (result === 'loss') stats.losses += 1;
  else stats.draws += 1;

  const summary: SavedGameSummary = {
    id: `game_${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    mode,
    opponentName,
    playerColor,
    result,
    reason,
    movesCount,
    pgn,
    fenFinal,
  };

  stats.history = [summary, ...stats.history].slice(0, 50); // keep last 50 games
  saveUserStats(stats);
  return stats;
}

export function downloadPgnFile(pgn: string, filename = 'game.pgn') {
  const blob = new Blob([pgn], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
