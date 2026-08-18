'use client';

import React from 'react';
import { FileText } from 'lucide-react';

const CONTACT_EMAIL = 'abhi15724@gmail.com';
const LAST_UPDATED = 'August 17, 2026';

export const TermsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <FileText className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Terms of Service</h1>
      </div>
      <p className="text-xs text-zinc-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of grandmasterchess.in
            (&quot;the Site&quot;). By accessing or using the Site, you agree to be bound by these Terms.
            If you do not agree, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">1. Using the Site</h2>
          <p>
            The Site provides free online chess gameplay, including AI opponents and local
            pass-and-play, along with related educational content. You may use the Site for personal,
            non-commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">2. Accounts</h2>
          <p>
            Creating an account is optional. If you create one, you are responsible for maintaining
            the confidentiality of your login credentials and for all activity under your account. You
            must provide accurate information when registering.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">3. Acceptable use</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 marker:text-[#81b64c]">
            <li>Attempt to disrupt, overload, or interfere with the Site&apos;s normal operation</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
            <li>Use automated means (bots, scrapers) to interact with the Site outside of normal browser use</li>
            <li>Use the Site for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">4. Intellectual property</h2>
          <p>
            The Site&apos;s design, code, and original written content (including blog articles) are the
            property of Grandmaster Chess Online unless otherwise noted. You may not reproduce or
            redistribute this content for commercial purposes without permission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">5. Advertising</h2>
          <p>
            The Site may display third-party advertisements, including through Google AdSense. We are
            not responsible for the content of third-party ads or the practices of advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">6. Disclaimer of warranties</h2>
          <p>
            The Site is provided &quot;as is&quot; without warranties of any kind, express or implied. We do
            not guarantee the Site will be uninterrupted, error-free, or available at all times.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">7. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Grandmaster Chess Online shall not be liable for
            any indirect, incidental, or consequential damages arising from your use of the Site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">8. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Site after changes are
            posted constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">9. Governing law</h2>
          <p>These Terms are governed by the laws of India, without regard to conflict-of-law principles.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-100 mb-2">10. Contact us</h2>
          <p>
            Questions about these Terms can be sent to{' '}
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
