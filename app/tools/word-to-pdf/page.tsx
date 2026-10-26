import type { Metadata } from 'next';
import Link from 'next/link';
import { FileType2 } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { converterEnabled } from '@/lib/converter';
import { OfficeToPdf } from '@/components/tools/OfficeToPdf';
import { ToolShell, H2, A, type Faq } from '@/components/tools/ToolShell';

// Shown (and indexed) only when the conversion service is configured; otherwise the page is hidden from search and the sitemap.
export const metadata: Metadata = pageMetadata({
  title: 'Word to PDF Converter: DOCX to PDF',
  description: 'Convert a Word document (DOCX or DOC) to PDF online for free. Text, tables and images are kept, and the file is deleted right after conversion.',
  path: '/tools/word-to-pdf',
  absoluteTitle: true,
  ogLabel: 'Tools',
  noindex: !converterEnabled,
});

const FAQ: Faq[] = [
  { question: 'Is my document stored?', answer: 'No. The file is sent to our conversion service over an encrypted connection, converted in a temporary folder, and deleted immediately afterwards. It is not stored or shared.' },
  { question: 'Will the PDF look like my Word document?', answer: 'Usually very close, because LibreOffice reads the same file format. Complicated documents can differ slightly, especially if they use fonts that are not installed on the converter. Always check the result.' },
  { question: 'Which files and sizes are supported?', answer: 'DOCX and DOC files up to 25 MB. Password-protected documents cannot be converted.' },
];

export default function Page() {
  if (!converterEnabled) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-extrabold text-zinc-100">Word to PDF Converter</h1>
        <p className="mt-3 text-sm text-zinc-400">This converter is not available on this site right now. Try our <Link href="/tools/pdf-converter" className={A}>other PDF tools</Link>.</p>
      </div>
    );
  }
  return (
    <ToolShell
      name="Word to PDF"
      path="/tools/word-to-pdf"
      h1="Word to PDF Converter"
      icon={<FileType2 className="h-5 w-5" />}
      applicationCategory="UtilitiesApplication"
      intro="Convert a Word document (.docx or .doc) to a PDF. The conversion runs on our server using LibreOffice, and your file is deleted as soon as it is done."
      tool={<OfficeToPdf kind="word" />}
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
          <li>Text, headings, tables, lists and images are carried over, and the PDF text stays selectable.</li>
          <li>Fonts that are not installed on the converter are replaced by similar ones, which can change line breaks.</li>
          <li>To extract text from a PDF instead, use <Link href="/tools/pdf-to-word" className={A}>PDF to Word</Link>.</li>
        </ul>
      </section>
    </ToolShell>
  );
}
