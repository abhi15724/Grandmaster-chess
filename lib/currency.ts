/** Currency conversion helpers. Rates are euro-based (ECB reference rates), so any pair is a cross rate through EUR. */
export interface RatesPayload {
  base: 'EUR';
  date: string;
  /** Units of each currency per 1 EUR, including EUR itself (= 1). */
  rates: Record<string, number>;
}

/** Validates the Frankfurter /v1/latest response ({ amount, base, date, rates }) and normalises it to a EUR-based payload. */
export function parseRatesResponse(json: unknown): RatesPayload | null {
  if (!json || typeof json !== 'object') return null;
  const j = json as { base?: unknown; date?: unknown; rates?: unknown };
  if (j.base !== 'EUR' || typeof j.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) return null;
  if (!j.rates || typeof j.rates !== 'object') return null;
  const rates: Record<string, number> = { EUR: 1 };
  for (const [code, v] of Object.entries(j.rates as Record<string, unknown>)) {
    if (/^[A-Z]{3}$/.test(code) && typeof v === 'number' && Number.isFinite(v) && v > 0) rates[code] = v;
  }
  if (Object.keys(rates).length < 5) return null;
  return { base: 'EUR', date: j.date, rates };
}

export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number | null {
  const a = rates[from];
  const b = rates[to];
  if (!Number.isFinite(amount) || !a || !b) return null;
  return (amount / a) * b;
}

/** English currency name via the platform's own data (no hard-coded list), falling back to the code. */
export function currencyName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function formatCurrency(amount: number, code: string): string {
  const big = Math.abs(amount) >= 1;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'code',
      minimumFractionDigits: big ? 2 : 4,
      maximumFractionDigits: big ? 2 : 6,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${code}`;
  }
}
