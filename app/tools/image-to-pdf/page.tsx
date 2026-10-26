import type { Metadata } from 'next';
import Link from 'next/link';
import { ImagePlus } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { converterEnabled } from '@/lib/converter';
import { ImageToPdf } from '@/components/tools/ImageToPdf';
import { ToolShell, H2, A, type Faq } from '@/components/tools/ToolShell';

export const metadata: Metadata = pageMetadata({
  title: 'Image to PDF Converter: JPG and PNG to PDF',
  description:
    'Combine JPG, PNG and WebP images into one PDF. Reorder pages, choose A4 or Letter, no upload and no sign-up: it all happens in your browser.',
  path: '/tools/image-to-pdf',
  absoluteTitle: true,
  ogLabel: 'Tools',
});

const FAQ: Faq[] = [
  { question: 'Are my images uploaded anywhere?', answer: 'No. The PDF is built inside your browser, so your images never leave your device.' },
  { question: 'Can I combine several images into one PDF?', answer: 'Yes. Add up to 50 images, put them in the order you want with the arrow buttons, and each image becomes one page.' },
  { question: 'Which image formats work?', answer: 'JPG, PNG, WebP, GIF and BMP, plus any other format your browser can display. Photos taken on a phone are rotated correctly.' },
  { question: 'Will the image quality drop?', answer: 'PNG images are kept lossless. Other formats are saved as high-quality JPEG (quality 92), and images larger than 5000 pixels on the long side are scaled down to keep the file a sensible size.' },
  { question: 'What do the page size options mean?', answer: 'A4 and US Letter fit each image on a standard page with your chosen margin. "Same as image" makes each page the size of its image, which suits screenshots and scans.' },
];

export default function ImageToPdfPage() {
  return (
    <ToolShell
      name="Image to PDF"
      path="/tools/image-to-pdf"
      h1="Image to PDF Converter"
      icon={<ImagePlus className="h-5 w-5" />}
      applicationCategory="UtilitiesApplication"
      intro="Turn JPG, PNG and other images into a single PDF. Add your images, put them in order, choose a page size and download the PDF. Nothing is uploaded."
      tool={<ImageToPdf />}
      faq={FAQ}
      trail={[{ name: 'Tools', path: '/tools' }, { name: 'PDF Converter', path: '/tools/pdf-converter' }]}
      related={[
        { href: '/tools/pdf-converter', label: 'PDF converter tools', note: 'all the PDF and document converters.' },
        ...(converterEnabled ? [{ href: '/tools/word-to-pdf', label: 'Word to PDF', note: 'convert a DOCX document to PDF.' }, { href: '/tools/ppt-to-pdf', label: 'PowerPoint to PDF', note: 'convert slides to PDF.' }] : []),
        { href: '/tools/pdf-to-word', label: 'PDF to Word', note: 'extract the text of a PDF into a Word file.' },
      ]}
    >
      <section>
        <h2 className={H2}>How to convert images to PDF</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Choose your images, or drag them onto the box. You can add more later.</li>
          <li>Use the up and down arrows to set the page order, and the bin to remove an image.</li>
          <li>Pick the page size, orientation and margin.</li>
          <li>Select <strong className="text-zinc-100">Create PDF</strong>, then download the file.</li>
        </ol>
      </section>
      <section>
        <h2 className={H2}>Good to know</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Each image is placed on its own page, scaled to fit without stretching.</li>
          <li>For documents, scan or photograph each page, then combine the pages here in order.</li>
          <li>Need the text of a PDF as an editable file? See <Link href="/tools/pdf-to-word" className={A}>PDF to Word</Link>.</li>
        </ul>
      </section>
    </ToolShell>
  );
}
