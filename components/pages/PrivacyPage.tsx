import React from 'react';
import { Shield } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/site-config';

const LAST_UPDATED = 'October 23, 2026';

const H2 = 'text-base font-bold text-zinc-100 mb-2';
const STRONG = 'text-zinc-100';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Shield className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Privacy Policy</h1>
      </div>
      <p className="text-xs text-zinc-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section>
          <p>
            This policy explains what information Grandmasterchess (grandmasterchess.in, &quot;we&quot;, &quot;the Site&quot;) collects, why, who else
            receives it, and the choices you have. The Site is run by an individual publisher in India; see the{' '}
            <a href="/about#author" className="text-[#81b64c] hover:underline">About page</a>.
          </p>
        </section>

        <section>
          <h2 className={H2}>1. What we collect</h2>
          <p className="mb-2">
            <strong className={STRONG}>Playing as a guest.</strong> You can play every mode without an account. We do not ask for your name or email.
            A temporary guest name, rating and recent results are kept in your browser&apos;s session storage and disappear when you close the tab.
          </p>
          <p className="mb-2">
            <strong className={STRONG}>Creating an account.</strong> If you sign up, our authentication and database provider, Supabase, stores your
            email address and sign-in details, plus the rating, results and game history linked to your account so they sync across devices.
          </p>
          <p className="mb-2">
            <strong className={STRONG}>Preferences.</strong> Settings such as board theme and sound are stored in your browser.
          </p>
          <p>
            <strong className={STRONG}>Server logs.</strong> Our hosting provider (currently Vercel) processes technical data such as your IP address,
            browser type and the pages requested, in order to deliver the Site and keep it secure.
          </p>
        </section>

        <section>
          <h2 className={H2}>1a. Free tools</h2>
          <p className="mb-2">
            The chess tools, EMI calculator, Image to PDF and PDF to Word run in your browser. What you type or the files you choose are not sent to us.
          </p>
          <p className="mb-2">
            <strong className={STRONG}>Currency converter.</strong> Our server fetches euro reference exchange rates from the Frankfurter service (which publishes
            European Central Bank rates) and shares them with all visitors. Your amounts and choices are not sent to that service.
          </p>
          <p>
            <strong className={STRONG}>Word to PDF and PowerPoint to PDF</strong> (where offered). The file you choose is uploaded over an encrypted connection to our
            conversion service, converted in a temporary folder and deleted immediately afterwards. We do not keep, read or share the file or its contents.
          </p>
        </section>

        <section>
          <h2 className={H2}>2. Analytics</h2>
          <p>
            We do not currently run a third-party analytics tool on the Site. If we add one, we will name it here and, where the law requires, ask for
            your consent first.
          </p>
        </section>

        <section>
          <h2 className={H2}>3. Advertising and cookies</h2>
          <p className="mb-2">
            We use Google AdSense to show advertising. Google and its partners may use cookies or similar technologies on the Site to serve and
            measure ads, and to personalise them based on your visits to this and other websites, subject to your choices.
          </p>
          <p className="mb-2">
            In the European Economic Area, the United Kingdom and Switzerland, personalised advertising requires your consent. Where it applies,
            consent is requested through a consent message provided by Google&apos;s Privacy &amp; messaging tools, and you can change your choice at
            any time through the privacy controls shown by that message.
          </p>
          <p>
            You can opt out of personalised advertising in{' '}
            <a href="https://adssettings.google.com" className="text-[#81b64c] hover:underline" rel="noopener noreferrer" target="_blank">Google Ad Settings</a>
            , or learn how Google uses information from sites that use its services at{' '}
            <a href="https://policies.google.com/technologies/partner-sites" className="text-[#81b64c] hover:underline" rel="noopener noreferrer" target="_blank">policies.google.com/technologies/partner-sites</a>.
            We never encourage anyone to click advertisements.
          </p>
        </section>

        <section>
          <h2 className={H2}>4. Third-party services we use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className={STRONG}>Supabase</strong>: authentication and database for account holders.</li>
            <li><strong className={STRONG}>Vercel</strong>: website hosting and delivery.</li>
            <li><strong className={STRONG}>Google Fonts</strong>: the Site loads fonts from Google&apos;s servers, which means your IP address is sent to Google when a page loads.</li>
            <li><strong className={STRONG}>Google Translate</strong>: only if you choose a language in the language picker. We then load Google&apos;s website translator, which sends the text of the page you are viewing and your IP address to Google to translate it, and Google may set its own cookies. We store your choice in a cookie named googtrans so the page stays translated; choosing English removes it. Nothing is sent to Google for translation unless you pick a language.</li>
            <li><strong className={STRONG}>Google AdSense</strong>: advertising, as described above.</li>
          </ul>
          <p className="mt-2">Each provider handles data under its own privacy policy.</p>
        </section>

        <section>
          <h2 className={H2}>5. How we use information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To run the games and, for account holders, save ratings and history.</li>
            <li>To keep the Site secure, reliable and fast.</li>
            <li>To answer messages you send us.</li>
            <li>To show advertising, as described above.</li>
          </ul>
          <p className="mt-2">We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className={H2}>6. Retention and deletion</h2>
          <p>
            Account data is kept while your account is active. You can ask us to delete your account and its data at any time by emailing the address
            below. Server logs are kept by our hosting provider for the period set in its own policy.
          </p>
        </section>

        <section>
          <h2 className={H2}>7. Your rights</h2>
          <p>
            Depending on where you live (for example under the GDPR or UK GDPR, or India&apos;s Digital Personal Data Protection Act), you may have the
            right to access, correct or delete your personal data, to withdraw consent, and to object to or restrict some processing. Email us to
            exercise these rights.
          </p>
        </section>

        <section>
          <h2 className={H2}>8. Children</h2>
          <p>
            The Site is not directed at children under 13, and we do not knowingly collect personal information from them. If you believe a child has
            created an account, contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className={H2}>9. Changes</h2>
          <p>We will update this page and its date when our practices change.</p>
        </section>

        <section>
          <h2 className={H2}>10. Contact</h2>
          <p>
            Privacy questions or requests:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#81b64c] hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};
