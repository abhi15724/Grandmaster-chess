/**
 * EMI (equated monthly instalment) maths for a reducing-balance loan.
 * Works in whole paise/cents so the schedule adds up exactly and the final payment absorbs rounding.
 */
export interface EmiInput {
  principal: number;
  annualRatePct: number;
  months: number;
}

export interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface YearSummary {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: ScheduleRow[];
  years: YearSummary[];
}

export const LIMITS = { maxPrincipal: 1_000_000_000_000, maxRate: 100, maxMonths: 600 } as const;

export function validateEmi(i: EmiInput): string | null {
  if (!Number.isFinite(i.principal) || i.principal <= 0) return 'Enter a loan amount greater than zero.';
  if (i.principal > LIMITS.maxPrincipal) return 'That loan amount is too large to calculate.';
  if (!Number.isFinite(i.annualRatePct) || i.annualRatePct < 0) return 'Enter an interest rate of zero or more.';
  if (i.annualRatePct > LIMITS.maxRate) return `Enter an interest rate of ${LIMITS.maxRate}% or less.`;
  if (!Number.isInteger(i.months) || i.months < 1) return 'Enter a loan tenure of at least one month.';
  if (i.months > LIMITS.maxMonths) return `Enter a tenure of ${LIMITS.maxMonths / 12} years (${LIMITS.maxMonths} months) or less.`;
  return null;
}

/** Monthly instalment before rounding: P*r*(1+r)^n / ((1+r)^n - 1), or P/n at 0% interest. */
export function rawEmi(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

export function calculateEmi(input: EmiInput): EmiResult | null {
  if (validateEmi(input) !== null) return null;
  const { principal, annualRatePct, months } = input;
  const r = annualRatePct / 12 / 100;
  const P = Math.round(principal * 100); // paise
  const emiPaise = Math.round(rawEmi(principal, annualRatePct, months) * 100);

  const schedule: ScheduleRow[] = [];
  let balance = P;
  let totalPaid = 0;
  for (let m = 1; m <= months; m++) {
    const interest = Math.round(balance * r);
    // The last instalment clears whatever is left, absorbing rounding differences.
    const principalPart = m === months ? balance : Math.min(balance, emiPaise - interest);
    const payment = principalPart + interest;
    balance -= principalPart;
    totalPaid += payment;
    schedule.push({ month: m, payment: payment / 100, principal: principalPart / 100, interest: interest / 100, balance: balance / 100 });
  }

  const years: YearSummary[] = [];
  for (let y = 0; y * 12 < months; y++) {
    const rows = schedule.slice(y * 12, y * 12 + 12);
    years.push({
      year: y + 1,
      principal: round2(rows.reduce((a, x) => a + x.principal, 0)),
      interest: round2(rows.reduce((a, x) => a + x.interest, 0)),
      balance: rows[rows.length - 1].balance,
    });
  }

  return {
    emi: emiPaise / 100,
    totalInterest: (totalPaid - P) / 100,
    totalPayment: totalPaid / 100,
    schedule,
    years,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const LOCALES: Record<string, string> = { INR: 'en-IN', USD: 'en-US', GBP: 'en-GB', EUR: 'en-IE', NONE: 'en-US' };

/** Formats an amount for a currency choice ("INR", "USD", "GBP", "EUR") or as a plain number ("NONE"). */
export function formatMoney(amount: number, currency: string): string {
  const locale = LOCALES[currency] ?? 'en-US';
  if (currency === 'NONE') return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}
