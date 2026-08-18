'use client';

import React from 'react';
import { Mail, MessageSquare, Bug, HelpCircle } from 'lucide-react';

const CONTACT_EMAIL = 'abhi15724@gmail.com';

export const ContactPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">
          <Mail className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Contact Us</h1>
      </div>
      <p className="text-sm text-zinc-400 mb-8">
        Questions, feedback, or something not working right? We read every message.
      </p>

      <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email us directly</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-lg font-bold text-[#81b64c] hover:underline break-all"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-xs text-zinc-400 mt-2">We typically reply within a few business days.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-4">
          <Bug className="h-4 w-4 text-[#81b64c] mb-1.5" />
          <p className="text-xs font-bold text-zinc-100">Report a bug</p>
          <p className="text-[11px] text-zinc-400 mt-1">Tell us what page you were on and what happened — screenshots help a lot.</p>
        </div>
        <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-4">
          <MessageSquare className="h-4 w-4 text-[#81b64c] mb-1.5" />
          <p className="text-xs font-bold text-zinc-100">Send feedback</p>
          <p className="text-[11px] text-zinc-400 mt-1">Ideas for new features or things that could be better — we read all of it.</p>
        </div>
        <div className="rounded-lg border border-[#3c3934] bg-[#1e1c19] p-4">
          <HelpCircle className="h-4 w-4 text-[#81b64c] mb-1.5" />
          <p className="text-xs font-bold text-zinc-100">General questions</p>
          <p className="text-[11px] text-zinc-400 mt-1">Check our <a href="/faq" className="text-[#81b64c] hover:underline">FAQ page</a> first — your question might already be answered there.</p>
        </div>
      </div>
    </div>
  );
};
