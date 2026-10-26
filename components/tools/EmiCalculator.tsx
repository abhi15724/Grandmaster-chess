'use client';

import React, { useState } from 'react';
import { calculateEmi, formatMoney, validateEmi } from '@/lib/emi';

const field =
  'w-full rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2.5 text-sm text-zinc-100 focus:border-[#81b64c] focus:outline-none';
const label = 'mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-400';

const num = (s: string) => Number(s.replace(/,/g, ''));

export const EmiCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('INR');
  const [amount, setAmount] = useState('1000000');
  const [rate, setRate] = useState('9');
  const [tenure, setTenure] = useState('10');
  const [unit, setUnit] = useState<'years' | 'months'>('years');
  const [monthly, setMonthly] = useState(false);

  const months = Math.round(num(tenure) * (unit === 'years' ? 12 : 1));
  const input = { principal: num(amount), annualRatePct: num(rate), months };
  const error = validateEmi(input);
  // Cheap enough (at most 600 rows) to recompute on every change.
  const result = calculateEmi(input);
  const fmt = (n: number) => formatMoney(n, currency);

  const interestShare = result ? result.totalInterest / result.totalPayment : 0;
  const C = 2 * Math.PI * 40;

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="emi-amount" className={label}>Loan amount</label>
          <input id="emi-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="emi-currency" className={label}>Currency</label>
          <select id="emi-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={field}>
            <option value="INR">Indian rupee (₹)</option>
            <option value="USD">US dollar ($)</option>
            <option value="GBP">Pound sterling (£)</option>
            <option value="EUR">Euro (€)</option>
            <option value="NONE">No symbol</option>
          </select>
        </div>
        <div>
          <label htmlFor="emi-rate" className={label}>Interest rate (% per year)</label>
          <input id="emi-rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="emi-tenure" className={label}>Loan tenure</label>
          <div className="flex gap-2">
            <input id="emi-tenure" inputMode="decimal" value={tenure} onChange={(e) => setTenure(e.target.value)} className={field} />
            <select aria-label="Tenure unit" value={unit} onChange={(e) => setUnit(e.target.value as 'years' | 'months')} className={`${field} w-32`}>
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg border border-[#3c3934] bg-[#161512] p-3 text-sm text-zinc-300">{error}</p>}

      {result && (
        <div className="mt-6" aria-live="polite">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Monthly EMI</p>
                <p className="text-3xl font-extrabold text-[#81b64c]" data-testid="emi-value">{fmt(result.emi)}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs text-zinc-500">Principal amount</dt><dd className="font-bold text-zinc-100">{fmt(num(amount))}</dd></div>
                <div><dt className="text-xs text-zinc-500">Total interest</dt><dd className="font-bold text-zinc-100" data-testid="emi-interest">{fmt(result.totalInterest)}</dd></div>
                <div className="col-span-2"><dt className="text-xs text-zinc-500">Total amount payable</dt><dd className="font-bold text-zinc-100" data-testid="emi-total">{fmt(result.totalPayment)}</dd></div>
              </dl>
            </div>
            <figure className="mx-auto" aria-label={`Of every ${(interestShare * 100).toFixed(0)} in 100 you pay, interest is ${(interestShare * 100).toFixed(0)}`}>
              <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90" role="img" aria-label="Principal versus interest">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#81b64c" strokeWidth="16" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e8c547" strokeWidth="16" strokeDasharray={`${interestShare * C} ${C}`} />
              </svg>
              <figcaption className="mt-1 flex justify-center gap-3 text-[11px] text-zinc-400">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#81b64c]" />Principal {((1 - interestShare) * 100).toFixed(0)}%</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#e8c547]" />Interest {(interestShare * 100).toFixed(0)}%</span>
              </figcaption>
            </figure>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border border-[#3c3934] text-left text-xs">
              <caption className="p-2 text-left text-zinc-400">Year-by-year repayment</caption>
              <thead className="bg-[#262421] text-zinc-300">
                <tr><th className="p-2">Year</th><th className="p-2">Principal paid</th><th className="p-2">Interest paid</th><th className="p-2">Balance at year end</th></tr>
              </thead>
              <tbody>
                {result.years.map((y) => (
                  <tr key={y.year} className="border-t border-[#3c3934]">
                    <td className="p-2">{y.year}</td><td className="p-2">{fmt(y.principal)}</td><td className="p-2">{fmt(y.interest)}</td><td className="p-2">{fmt(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={() => setMonthly((m) => !m)} aria-expanded={monthly} className="mt-4 rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2 text-xs font-semibold text-zinc-200 hover:border-[#81b64c]/60">
            {monthly ? 'Hide' : 'Show'} the month-by-month schedule
          </button>
          {monthly && (
            <div className="mt-3 max-h-96 overflow-auto rounded-lg border border-[#3c3934]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#262421] text-zinc-300">
                  <tr><th className="p-2">Month</th><th className="p-2">EMI</th><th className="p-2">Principal</th><th className="p-2">Interest</th><th className="p-2">Balance</th></tr>
                </thead>
                <tbody>
                  {result.schedule.map((r) => (
                    <tr key={r.month} className="border-t border-[#3c3934]">
                      <td className="p-2">{r.month}</td><td className="p-2">{fmt(r.payment)}</td><td className="p-2">{fmt(r.principal)}</td><td className="p-2">{fmt(r.interest)}</td><td className="p-2">{fmt(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
