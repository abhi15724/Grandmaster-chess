import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { converterEnabled } from '@/lib/converter';
import { PdfToWord } from '@/components/tools/PdfToWord';
import { ToolShell, H2, A, type Faq } from '@/components/tools/ToolShell';

export const metadata: Metadata = pageMetadata({
  title: 'PDF to Word: Extract Text to a DOCX File',
  description:
    'Convert the text and headings of a PDF into an editable Word file, free, in your browser with no upload. Best for text-based PDFs in English.',
  path: '/tools/pdf-to-word',
  absoluteTitle: true,
  ogLabel: 'Tools',
});

const FAQ: Faq[] = [
  { question: 'Is my PDF uploaded?', answer: 'No. The PDF is read inside your browser and the Word file is created there too, so the document never leaves your device.' },
  { question: 'What is converted and what is not?', answer: 'Text is extracted and organised into paragraphs and headings, with a page break between pages. Images, tables, columns, fonts and exact layout are not carried over, so this suits text documents rather than designed layouts.' },
  { question: 'Why does my scanned PDF give no text?', answer: 'A scan is a picture of a page, with no text inside it. Reading it needs OCR (optical character recognition), which this tool does not do.' },
  { question: 'Does it work for Hindi, Tamil or other Indian scripts?', answer: 'Not reliably. Many PDFs store these scripts in a form that cannot be mapped back to the correct characters, so the tool shows a warning and you should check the result. Text in English and other Latin-script languages converts best.' },
  { question: 'Can it open a password-protected PDF?', answer: 'No. Remove the password in the program that created the file, then try again.' },
];

export default function PdfToWordPage() {
  return (
    <ToolShell
      name="PDF to Word"
      path="/tools/pdf-to-word"
      h1="PDF to Word Converter (Text Extraction)"
      icon={<FileText className="h-5 w-5" />}
      applicationCategory="UtilitiesApplication"
      intro="Pull the text out of a PDF and get it as an editable Word (.docx) file. It runs in your browser, so the file is never uploaded. This works best for text documents and does not preserve layout."
      tool={<PdfToWord />}
      faq={FAQ}
      trail={[{ name: 'Tools', path: '/tools' }, { name: 'PDF Converter', path: '/tools/pdf-converter' }]}
      related={[
        { href: '/tools/pdf-converter', label: 'PDF converter tools', note: 'all the PDF and document converters.' },
        ...(converterEnabled ? [{ href: '/tools/word-to-pdf', label: 'Word to PDF', note: 'convert a DOCX document to PDF.' }, { href: '/tools/ppt-to-pdf', label: 'PowerPoint to PDF', note: 'convert slides to PDF.' }] : []),
        { href: '/tools/image-to-pdf', label: 'Image to PDF', note: 'combine images into a PDF.' },
      ]}
    >
      <section>
        <h2 className={H2}>How it works</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Choose a PDF. The tool reads the text on every page, in reading order.</li>
          <li>Lines are joined into paragraphs, and larger text becomes a Word heading.</li>
          <li>Download the .docx file and edit it in Word, Google Docs or LibreOffice.</li>
        </ol>
      </section>
      <section>
        <h2 className={H2}>When another tool is a better fit</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>For a PDF with complex tables, columns or artwork, use the program that created it, or a desktop converter that rebuilds the layout.</li>
          <li>For a scanned page, use an OCR tool first.</li>
          <li>To go the other way, combine pictures with <Link href="/tools/image-to-pdf" className={A}>Image to PDF</Link>.</li>
        </ul>
      </section>
    </ToolShell>
  );
}
