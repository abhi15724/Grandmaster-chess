import type { Metadata } from 'next';
import { Landmark } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { calculateEmi, formatMoney } from '@/lib/emi';
import { EmiCalculator } from '@/components/tools/EmiCalculator';
import { ToolShell, H2, type Faq } from '@/components/tools/ToolShell';

export const metadata: Metadata = pageMetadata({
  title: 'EMI Calculator: Monthly Loan Payment and Schedule',
  description:
    'Calculate your loan EMI, total interest and full repayment schedule for a home, car or personal loan. Free, instant, and nothing you enter is stored.',
  path: '/tools/emi-calculator',
  absoluteTitle: true,
  ogLabel: 'Tools',
});

const FAQ: Faq[] = [
  { question: 'What is an EMI?', answer: 'EMI stands for equated monthly instalment: the fixed amount you pay every month until a loan is repaid. Each payment covers the interest for that month plus part of the loan itself.' },
  { question: 'How is EMI calculated?', answer: 'With the formula EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the loan amount, r is the monthly interest rate (the yearly rate divided by 12 and by 100) and n is the number of monthly payments.' },
  { question: 'Does this calculator use the reducing-balance method?', answer: 'Yes. Interest is charged each month on the balance still owed, which is how most bank loans work. Loans quoted at a flat rate charge interest on the original amount throughout, so their effective cost is higher than the same percentage on a reducing balance.' },
  { question: 'Why is most of my early EMI interest?', answer: 'Because interest is charged on the outstanding balance, which is largest at the start. As the balance falls, a larger share of each payment goes to the principal. The month-by-month schedule shows this.' },
  { question: 'Will my lender\'s EMI be exactly the same?', answer: 'It can differ slightly. Lenders may round differently, count days instead of months, change the rate on floating-rate loans, or add processing fees and insurance, which this calculator does not include.' },
];

export default function EmiCalculatorPage() {
  const P = 1_000_000;
  const rows = [5, 10, 15, 20].map((y) => ({ y, r: calculateEmi({ principal: P, annualRatePct: 9, months: y * 12 })! }));
  const ten = rows[1].r;
  return (
    <ToolShell
      name="EMI Calculator"
      path="/tools/emi-calculator"
      h1="EMI Calculator"
      icon={<Landmark className="h-5 w-5" />}
      applicationCategory="FinanceApplication"
      intro="Enter a loan amount, interest rate and tenure to see your monthly EMI, the total interest you will pay, and the full repayment schedule. Everything is calculated in your browser."
      tool={<EmiCalculator />}
      faq={FAQ}
      related={[
        { href: '/tools/currency-converter', label: 'Currency converter', note: 'convert a loan or price between currencies.' },
        { href: '/tools', label: 'All free tools', note: 'chess and everyday tools.' },
      ]}
    >
      <section>
        <h2 className={H2}>The EMI formula</h2>
        <p className="mb-2">
          <code className="rounded bg-[#262421] px-1.5 py-0.5 text-[#81b64c]">EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)</code>
        </p>
        <p>
          P is the loan amount, r is the monthly rate (annual rate ÷ 12 ÷ 100) and n is the number of months. At a 0% rate the formula is not needed: the
          EMI is simply P ÷ n.
        </p>
      </section>
      <section>
        <h2 className={H2}>A worked example</h2>
        <p className="mb-3">
          A loan of {formatMoney(P, 'INR')} at 9% a year for 10 years (120 months) has an EMI of <strong className="text-zinc-100">{formatMoney(ten.emi, 'INR')}</strong>. Over the
          whole term you pay {formatMoney(ten.totalPayment, 'INR')}, of which {formatMoney(ten.totalInterest, 'INR')} is interest. In the first month the interest
          is {formatMoney(ten.schedule[0].interest, 'INR')} and only {formatMoney(ten.schedule[0].principal, 'INR')} reduces the loan.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-xl border border-[#3c3934] text-left text-xs">
            <caption className="p-2 text-left text-zinc-400">The same {formatMoney(P, 'INR')} loan at 9%, over different tenures</caption>
            <thead className="bg-[#262421] text-zinc-300"><tr><th className="p-2">Tenure</th><th className="p-2">EMI</th><th className="p-2">Total interest</th><th className="p-2">Total payable</th></tr></thead>
            <tbody>
              {rows.map(({ y, r }) => (
                <tr key={y} className="border-t border-[#3c3934]">
                  <td className="p-2">{y} years</td><td className="p-2">{formatMoney(r.emi, 'INR')}</td><td className="p-2">{formatMoney(r.totalInterest, 'INR')}</td><td className="p-2">{formatMoney(r.totalPayment, 'INR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">A longer tenure lowers the EMI but increases the total interest, and a shorter tenure does the opposite.</p>
      </section>
      <section>
        <h2 className={H2}>What this calculator does not include</h2>
        <p>
          Processing fees, insurance, taxes, rate changes on floating-rate loans and prepayments are not included, so treat the result as an estimate and
          confirm the figures with your lender. This tool is for information only and is not financial advice.
        </p>
      </section>
    </ToolShell>
  );
}
