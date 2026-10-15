import Link from 'next/link';

export interface SeoLink {
  href: string;
  label: string;
}

interface SeoContentProps {
  heading: string;
  paragraphs: string[];
  links?: SeoLink[];
}

/** Server-rendered, crawlable copy block placed under interactive pages so each
 *  URL has unique, keyword-relevant text plus real internal links. */
export function SeoContent({ heading, paragraphs, links = [] }: SeoContentProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-12 pt-2 text-sm leading-relaxed text-zinc-400">
      <h2 className="mb-3 text-lg font-extrabold tracking-tight text-zinc-100">{heading}</h2>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="mb-3">
          {p}
        </p>
      ))}
      {links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-[#81b64c] hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
