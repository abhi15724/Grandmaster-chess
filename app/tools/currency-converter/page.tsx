import type { Metadata } from 'next';
import { ArrowLeftRight } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { CurrencyConverter } from '@/components/tools/CurrencyConverter';
import { ToolShell, H2, type Faq } from '@/components/tools/ToolShell';

export const metadata: Metadata = pageMetadata({
  title: 'Currency Converter with Daily ECB Exchange Rates',
  description:
    'Convert between about 30 major currencies, including USD, EUR, INR and GBP, using the European Central Bank daily reference rates. Free, no sign-up.',
  path: '/tools/currency-converter',
  absoluteTitle: true,
  ogLabel: 'Tools',
});

const FAQ: Faq[] = [
  { question: 'Where do these exchange rates come from?', answer: 'They are the euro foreign exchange reference rates published by the European Central Bank, delivered through the free Frankfurter service. The ECB publishes them once each working day, around 16:00 Central European Time.' },
  { question: 'Are these the rates my bank or card will use?', answer: 'No. Reference rates are a benchmark, not a price you can trade at. Banks, card networks and money-transfer services add their own margin or fees, so the amount you actually receive is usually lower than the figure shown here.' },
  { question: 'Why do the rates not change during the day or at weekends?', answer: 'Because the source publishes one set of rates per working day. On weekends and public holidays the latest published rates, from the previous working day, are shown. The date is displayed beside every result.' },
  { question: 'Why is my currency missing?', answer: 'The tool offers the currencies the ECB publishes, which is around 30. For example the UAE dirham, Saudi riyal and Pakistani rupee are not part of that set.' },
  { question: 'How is a conversion between two non-euro currencies calculated?', answer: 'Both currencies are expressed per euro, so the amount is divided by the first currency\'s rate and multiplied by the second one\'s. This is called a cross rate.' },
];

export default function CurrencyConverterPage() {
  return (
    <ToolShell
      name="Currency Converter"
      path="/tools/currency-converter"
      h1="Currency Converter"
      icon={<ArrowLeftRight className="h-5 w-5" />}
      applicationCategory="FinanceApplication"
      intro="Convert an amount between about 30 major currencies using the European Central Bank's daily reference rates. The date of the rates is shown with every result."
      tool={<CurrencyConverter />}
      faq={FAQ}
      related={[
        { href: '/tools/emi-calculator', label: 'EMI calculator', note: 'work out the monthly payment on a loan.' },
        { href: '/tools', label: 'All free tools', note: 'chess and everyday tools.' },
      ]}
      sources={[
        { title: 'European Central Bank: euro foreign exchange reference rates', url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html' },
        { title: 'Frankfurter: free currency exchange rate API', url: 'https://frankfurter.dev' },
      ]}
    >
      <section>
        <h2 className={H2}>How to use the converter</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Type the amount you want to convert.</li>
          <li>Choose the currency you have in the first list and the one you want in the second. The swap button reverses them.</li>
          <li>Read the result, the rate in both directions and the date of the rates. The table underneath shows common amounts.</li>
        </ol>
      </section>
      <section>
        <h2 className={H2}>About reference rates</h2>
        <p>
          A reference rate is a single daily benchmark, which makes it a good way to check a quote or estimate a cost. It is not a live market price and it
          is not a quote from a bank, so use it for planning rather than for trading. Anything with an official fee or margin, such as a card payment or a
          transfer, will differ.
        </p>
      </section>
      <p className="text-xs text-zinc-500">This tool is for information only and is not financial advice.</p>
    </ToolShell>
  );
}
