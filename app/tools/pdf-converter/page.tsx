import type { Metadata } from 'next';
import Link from 'next/link';
import { Files, ImagePlus, FileText, FileType2, Presentation } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { converterEnabled } from '@/lib/converter';
import { ToolShell, H2, A, type Faq } from '@/components/tools/ToolShell';

export const metadata: Metadata = pageMetadata({
  title: 'Free PDF Converter Tools',
  description:
    'Free PDF converters: images to PDF, PDF to Word, Word to PDF and PowerPoint to PDF. Some run entirely in your browser, with no upload.',
  path: '/tools/pdf-converter',
  ogLabel: 'Tools',
});

const FAQ: Faq[] = [
  { question: 'Which converters run in my browser?', answer: 'Image to PDF and PDF to Word run entirely in your browser, so your files are not uploaded.' },
  { question: 'Which converters upload my file?', answer: 'Word to PDF and PowerPoint to PDF use a conversion service because they need LibreOffice. The file is sent over an encrypted connection, converted in a temporary folder and deleted immediately.' },
  { question: 'Are the converters free?', answer: 'Yes. There is no sign-up and no watermark.' },
];

const TOOLS = [
  { href: '/tools/image-to-pdf', name: 'Image to PDF', icon: ImagePlus, text: 'Combine JPG, PNG and WebP images into one PDF. Runs in your browser.', on: true },
  { href: '/tools/pdf-to-word', name: 'PDF to Word', icon: FileText, text: 'Extract the text and headings of a PDF into a Word file. Runs in your browser.', on: true },
  { href: '/tools/word-to-pdf', name: 'Word to PDF', icon: FileType2, text: 'Convert a DOCX or DOC document to PDF.', on: converterEnabled },
  { href: '/tools/ppt-to-pdf', name: 'PowerPoint to PDF', icon: Presentation, text: 'Convert a PPTX or PPT presentation to PDF, one page per slide.', on: converterEnabled },
].filter((t) => t.on);

export default function PdfConverterPage() {
  return (
    <ToolShell
      name="PDF Converter Tools"
      path="/tools/pdf-converter"
      h1="Free PDF Converter Tools"
      icon={<Files className="h-5 w-5" />}
      applicationCategory="UtilitiesApplication"
      intro="Convert between PDFs, images, Word documents and presentations. Choose a converter below. No sign-up and no watermark."
      tool={
        <ul className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="flex h-full gap-4 rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 transition-colors hover:border-[#81b64c]/60">
                <t.icon className="mt-0.5 h-6 w-6 shrink-0 text-[#81b64c]" />
                <span>
                  <span className="block text-base font-bold text-zinc-100">{t.name}</span>
                  <span className="mt-1 block text-sm text-zinc-400">{t.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      }
      faq={FAQ}
    >
      <section>
        <h2 className={H2}>Your files and privacy</h2>
        <p>
          Image to PDF and PDF to Word never send your file anywhere. The other converters send it to our conversion service, which deletes it as soon as
          the PDF is ready. See our <Link href="/privacy" className={A}>privacy policy</Link> for details.
        </p>
      </section>
    </ToolShell>
  );
}
