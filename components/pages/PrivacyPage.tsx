'use client';

import React from 'react';
import { Shield } from 'lucide-react';

const CONTACT_EMAIL = 'abhi15724@gmail.com';
const LAST_UPDATED = 'August 17, 2026';

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
            This Privacy Policy explains what information Grandmaster Chess Online
            (&quot;we&quot;, &quot;us&quot;, &quot;the Site&quot;) collects, how it is used, and the choices you have.
            By using grandmasterchess.in, you agree to the practices described here.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">1. Information we collect</h2>
          <p className="mb-2"><strong className="text-zinc-100">Playing without an account.</strong> You can play every game mode on this Site without creating an account. In this case, we do not collect any personal information about you — gameplay data stays only in your browser session.</p>
          <p className="mb-2"><strong className="text-zinc-100">Creating an account.</strong> If you choose to sign up, we collect your email address and authentication details via our backend provider, Supabase. We also store gameplay-related data tied to your account: rating, win/loss/draw record, and game history, so this information can sync across your devices.</p>
          <p><strong className="text-zinc-100">Automatically collected data.</strong> Like most websites, our hosting provider (Vercel) may automatically log standard technical information such as IP address, browser type, device type, and pages visited, for security and performance purposes.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">2. Cookies and similar technologies</h2>
          <p className="mb-2">
            We use essential cookies/local storage to keep you signed in and to remember basic
            preferences (such as board theme).
          </p>
          <p>
            If this Site displays advertising, third-party vendors, including Google, may use cookies
            to serve ads based on your prior visits to this or other websites. Google&apos;s use of
            advertising cookies enables it and its partners to serve ads based on your visit to this
            site and/or other sites on the Internet. You may opt out of personalized advertising by
            visiting{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#81b64c] hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">3. How we use your information</h2>
          <ul className="list-disc list-inside space-y-1 marker:text-[#81b64c]">
            <li>To provide and maintain core gameplay functionality</li>
            <li>To sync your rating, stats, and game history across devices if you have an account</li>
            <li>To respond to support requests sent to us directly</li>
            <li>To monitor and improve Site performance and security</li>
            <li>To display advertising, where applicable, in accordance with this policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">4. Third-party services</h2>
          <p className="mb-2">We rely on the following third-party services to operate this Site:</p>
          <ul className="list-disc list-inside space-y-1 marker:text-[#81b64c]">
            <li><strong className="text-zinc-100">Supabase</strong> — authentication and database storage for account holders</li>
            <li><strong className="text-zinc-100">Vercel</strong> — website hosting and infrastructure</li>
            <li><strong className="text-zinc-100">Google AdSense</strong> (where enabled) — advertising, subject to Google&apos;s own privacy policy</li>
          </ul>
          <p className="mt-2">Each of these providers has its own privacy practices governing the data they process on our behalf.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">5. Data retention</h2>
          <p>
            If you have an account, we retain your account data for as long as your account remains
            active. You may request deletion of your account and associated data at any time by
            contacting us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">6. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your
            personal data, and to object to or restrict certain processing. To exercise any of these
            rights, contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">7. Children&apos;s privacy</h2>
          <p>
            This Site is not directed at children under 13, and we do not knowingly collect personal
            information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">8. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected
            by updating the &quot;Last updated&quot; date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">9. Contact us</h2>
          <p>
            Questions about this Privacy Policy can be sent to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#81b64c] hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
