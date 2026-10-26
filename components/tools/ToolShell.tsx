import React from 'react';
import Link from 'next/link';
import { jsonLdGraph, breadcrumbSchema, faqSchema, personSchema } from '@/lib/json-ld';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';

export interface Faq { question: string; answer: string }
export interface Source { title: string; url: string }

interface Props {
  name: string;
  path: string;
  h1: string;
  intro: React.ReactNode;
  icon: React.ReactNode;
  applicationCategory: 'UtilitiesApplication' | 'FinanceApplication' | 'EducationalApplication';
  tool: React.ReactNode;
  faq?: Faq[];
  sources?: Source[];
  related?: { href: string; label: string; note: string }[];
  /** Breadcrumb trail between Home and this page, e.g. [{name:'Tools',path:'/tools'}] */
  trail?: { name: string; path: string }[];
  children?: React.ReactNode;
}

export const H2 = 'mb-2 text-lg font-bold text-zinc-100';
export const A = 'text-[#81b64c] hover:underline';

/** Shared layout for the tool pages: heading, tool, content sections, FAQ, related links, sources and structured data. */
export function ToolShell({ name, path, h1, intro, icon, applicationCategory, tool, faq, sources, related, trail = [{ name: 'Tools', path: '/tools' }], children }: Props) {
  const graph = jsonLdGraph(
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}${path}#app`,
      name,
      url: absoluteUrl(path),
      applicationCategory,
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@id': `${SITE_URL}/#author` },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    personSchema(),
    breadcrumbSchema([{ name: 'Home', path: '/' }, ...trail, { name, path }]),
    ...(faq && faq.length ? [faqSchema(faq)] : [])
  );
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81b64c] text-zinc-950">{icon}</div>
        <h1 className="text-2xl font-extrabold text-zinc-100 sm:text-3xl">{h1}</h1>
      </div>
      <div className="mb-6 text-sm text-zinc-400">{intro}</div>
      {tool}
      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
        {children}
        {faq && faq.length > 0 && (
          <section>
            <h2 className={H2}>Frequently asked questions</h2>
            <div className="space-y-4">
              {faq.map((f) => (
                <div key={f.question}>
                  <h3 className="font-bold text-zinc-100">{f.question}</h3>
                  <p>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {related && related.length > 0 && (
          <section>
            <h2 className={H2}>Related tools</h2>
            <ul className="list-disc space-y-1 pl-5">
              {related.map((r) => (
                <li key={r.href}><Link href={r.href} className={A}>{r.label}</Link>: {r.note}</li>
              ))}
            </ul>
          </section>
        )}
        {sources && sources.length > 0 && (
          <section>
            <h2 className={H2}>Sources</h2>
            <ul className="list-disc space-y-1 pl-5">
              {sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className={A}>{s.title}</a></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
