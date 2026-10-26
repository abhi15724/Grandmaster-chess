import { parseRatesResponse } from '@/lib/currency';

// Euro foreign-exchange reference rates (European Central Bank) via the free Frankfurter service. No API key.
// Fetched on the server and cached, so visitors never contact the provider and rates are shared between users.
// Always run per request (never baked in at build time); the hour-long cache below keeps upstream calls rare.
export const dynamic = 'force-dynamic';

const SOURCE = 'https://api.frankfurter.dev/v1/latest?base=EUR';

export async function GET() {
  try {
    const res = await fetch(SOURCE, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const payload = parseRatesResponse(await res.json());
    if (!payload) throw new Error('unexpected response shape');
    return Response.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return Response.json(
      { error: 'Exchange rates are temporarily unavailable. Please try again shortly.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
