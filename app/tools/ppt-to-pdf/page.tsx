import type { Metadata } from 'next';
import Link from 'next/link';
import { Presentation } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { converterEnabled } from '@/lib/converter';
import { OfficeToPdf } from '@/components/tools/OfficeToPdf';
import { ToolShell, H2, A, type Faq } from '@/components/tools/ToolShell';

// Shown (and indexed) only when the conversion service is configured; otherwise the page is hidden from search and the sitemap.
export const metadata: Metadata = pageMetadata({
  title: 'PowerPoint to PDF Converter: PPTX to PDF',
  description: 'Convert a PowerPoint presentation (PPTX or PPT) to PDF online for free, with one page per slide. The file is deleted right after conversion.',
  path: '/tools/ppt-to-pdf',
  absoluteTitle: true,
  ogLabel: 'Tools',
  noindex: !converterEnabled,
});

const FAQ: Faq[] = [
  { question: 'Is my presentation stored?', answer: 'No. The file is sent to our conversion service over an encrypted connection, converted in a temporary folder, and deleted immediately afterwards. It is not stored or shared.' },
  { question: 'Will every slide appear as a page?', answer: 'Yes, each slide becomes one PDF page. Animations and transitions are not kept in a PDF, and unusual fonts or effects may look slightly different.' },
  { question: 'Which files and sizes are supported?', answer: 'PPTX and PPT files up to 25 MB. Password-protected presentations cannot be converted.' },
];

export default function Page() {
  if (!converterEnabled) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-extrabold text-zinc-100">PowerPoint to PDF Converter</h1>
        <p className="mt-3 text-sm text-zinc-400">This converter is not available on this site right now. Try our <Link href="/tools/pdf-converter" className={A}>other PDF tools</Link>.</p>
      </div>
    );
  }
  return (
    <ToolShell
      name="PowerPoint to PDF"
      path="/tools/ppt-to-pdf"
      h1="PowerPoint to PDF Converter"
      icon={<Presentation className="h-5 w-5" />}
      applicationCategory="UtilitiesApplication"
      intro="Convert a PowerPoint presentation (.pptx or .ppt) to a PDF with one page per slide. The conversion runs on our server using LibreOffice, and your file is deleted as soon as it is done."
      tool={<OfficeToPdf kind="ppt" />}
      faq={FAQ}
      trail={[{ name: 'Tools', path: '/tools' }, { name: 'PDF Converter', path: '/tools/pdf-converter' }]}
      related={[
        { href: '/tools/pdf-converter', label: 'PDF converter tools', note: 'all the PDF and document converters.' },
        { href: '/tools/image-to-pdf', label: 'Image to PDF', note: 'combine images into a PDF.' },
      ]}
    >
      <section>
        <h2 className={H2}>How it works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Choose your file, or drag it onto the box.</li>
          <li>It is sent to our conversion service, which uses LibreOffice to produce the PDF.</li>
          <li>Download the PDF. The uploaded file is deleted as soon as the conversion finishes.</li>
        </ol>
      </section>
      <section>
        <h2 className={H2}>Good to know</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Each slide becomes one page, in order, and text in the PDF stays selectable.</li>
          <li>Animations, transitions, audio and video are not part of a PDF.</li>
          <li>Check the result: fonts that are not installed on the converter are replaced by similar ones.</li>
        </ul>
      </section>
    </ToolShell>
  );
}
