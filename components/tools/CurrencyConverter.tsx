'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { convert, currencyName, formatCurrency, type RatesPayload } from '@/lib/currency';

const POPULAR = ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD'];
const AMOUNTS = [1, 10, 100, 1000, 10000];

async function fetchRates(): Promise<RatesPayload> {
  const res = await fetch('/api/rates');
  if (!res.ok) throw new Error('unavailable');
  return (await res.json()) as RatesPayload;
}

const field =
  'w-full rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2.5 text-sm text-zinc-100 focus:border-[#81b64c] focus:outline-none';
const label = 'mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-400';

export const CurrencyConverter: React.FC = () => {
  const [data, setData] = useState<RatesPayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');

  useEffect(() => {
    let cancelled = false;
    fetchRates()
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setStatus('ready');
        // Fall back gracefully if the provider's list lacks a default currency.
        setFrom((f) => (d.rates[f] ? f : 'EUR'));
        setTo((t) => (d.rates[t] ? t : 'USD'));
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  const retry = () => {
    setStatus('loading');
    fetchRates()
      .then((d) => {
        setData(d);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  const options = useMemo(() => {
    if (!data) return [];
    const codes = Object.keys(data.rates);
    const popular = POPULAR.filter((c) => codes.includes(c));
    const rest = codes.filter((c) => !popular.includes(c)).sort();
    return [...popular, ...rest].map((code) => ({ code, name: currencyName(code) }));
  }, [data]);

  const value = Number(amount.replace(/,/g, ''));
  const valid = amount.trim() !== '' && Number.isFinite(value) && value >= 0;
  const result = data && valid ? convert(value, from, to, data.rates) : null;
  const unit = data ? convert(1, from, to, data.rates) : null;
  const inverse = data ? convert(1, to, from, data.rates) : null;

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6">
      {status === 'loading' && <p className="text-sm text-zinc-400" role="status">Loading the latest exchange rates...</p>}

      {status === 'error' && (
        <div role="alert" className="rounded-lg border border-[#3c3934] bg-[#161512] p-4 text-sm text-zinc-300">
          Exchange rates are temporarily unavailable, so no conversion can be shown right now.
          <button type="button" onClick={retry} className="ml-3 inline-flex items-center gap-1 rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:border-[#81b64c]/60">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      )}

      {status === 'ready' && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr_auto_1.4fr] sm:items-end">
            <div>
              <label htmlFor="cc-amount" className={label}>Amount</label>
              <input id="cc-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={field} aria-invalid={!valid} />
            </div>
            <div>
              <label htmlFor="cc-from" className={label}>From</label>
              <select id="cc-from" value={from} onChange={(e) => setFrom(e.target.value)} className={field}>
                {options.map((o) => <option key={o.code} value={o.code}>{o.code} - {o.name}</option>)}
              </select>
            </div>
            <button type="button" aria-label="Swap currencies" onClick={() => { setFrom(to); setTo(from); }} className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#3c3934] bg-[#262421] text-zinc-200 hover:border-[#81b64c]/60">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <div>
              <label htmlFor="cc-to" className={label}>To</label>
              <select id="cc-to" value={to} onChange={(e) => setTo(e.target.value)} className={field}>
                {options.map((o) => <option key={o.code} value={o.code}>{o.code} - {o.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#3c3934] bg-[#161512] p-4" aria-live="polite">
            {!valid && <p className="text-sm text-zinc-400">Enter an amount of zero or more.</p>}
            {valid && result !== null && (
              <>
                <p className="text-xs text-zinc-500">{formatCurrency(value, from)} equals</p>
                <p className="text-3xl font-extrabold text-zinc-100" data-testid="cc-result">{formatCurrency(result, to)}</p>
                {unit !== null && inverse !== null && (
                  <p className="mt-2 text-xs text-zinc-400">
                    1 {from} = {unit.toFixed(unit < 1 ? 6 : 4)} {to} &nbsp;|&nbsp; 1 {to} = {inverse.toFixed(inverse < 1 ? 6 : 4)} {from}
                  </p>
                )}
              </>
            )}
            <p className="mt-2 text-[11px] text-zinc-500">ECB reference rates for {data.date}. Not the rate a bank or card will give you.</p>
          </div>

          {valid && unit !== null && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full max-w-md border border-[#3c3934] text-left text-xs">
                <caption className="p-2 text-left text-zinc-400">Common amounts, {from} to {to}</caption>
                <thead className="bg-[#262421] text-zinc-300"><tr><th className="p-2">{from}</th><th className="p-2">{to}</th></tr></thead>
                <tbody>
                  {AMOUNTS.map((a) => (
                    <tr key={a} className="border-t border-[#3c3934]"><td className="p-2">{a.toLocaleString('en-US')}</td><td className="p-2">{(a * unit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
