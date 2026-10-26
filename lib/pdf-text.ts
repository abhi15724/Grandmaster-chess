/** One piece of text from a PDF page, in PDF coordinates (origin bottom-left, y grows upward). */
export interface RawItem {
  str: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Block {
  text: string;
  kind: 'heading1' | 'heading2' | 'paragraph';
}

interface Line {
  text: string;
  y: number;
  h: number;
  x: number;
}

/** Some PDFs map special glyphs to control characters; they are junk in a Word file. */
export const stripControlChars = (s: string) => s.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '');

// Indic, Arabic and other complex scripts, where PDF text often does not map back to the right characters.
const COMPLEX_SCRIPT = /[\u0600-\u06FF\u0900-\u0DFF\u0E00-\u0EFF\u1000-\u109F]/;

/** Advisory messages about text that is likely to extract badly. */
export function textQualityWarnings(pages: RawItem[][]): string[] {
  const warnings: string[] = [];
  const all = pages.flat().map((i) => i.str);
  if (all.some((s) => /[\u0000-\u0008\u000B-\u001F\u007F]/.test(s)) || all.some((s) => COMPLEX_SCRIPT.test(s))) {
    warnings.push(
      'This PDF contains text in a script such as Hindi, Tamil or Arabic. PDFs often store these scripts in a way that cannot be read back exactly, so please check the Word file for missing or wrong characters.'
    );
  }
  return warnings;
}

const median = (xs: number[]) => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Joins the text items of one page into reading-order lines. */
export function itemsToLines(rawItems: RawItem[]): Line[] {
  const items = rawItems.map((i) => ({ ...i, str: stripControlChars(i.str) }));
  const real = items.filter((i) => i.str.trim().length > 0 && Number.isFinite(i.x) && Number.isFinite(i.y));
  if (real.length === 0) return [];
  const tol = Math.max(1, median(real.map((i) => i.h)) * 0.5);
  const sorted = [...real].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows: RawItem[][] = [];
  for (const it of sorted) {
    const row = rows.find((r) => Math.abs(r[0].y - it.y) <= tol);
    if (row) row.push(it);
    else rows.push([it]);
  }
  rows.sort((a, b) => b[0].y - a[0].y);
  return rows.map((row) => {
    row.sort((a, b) => a.x - b.x);
    let text = '';
    let prev: RawItem | null = null;
    for (const it of row) {
      if (prev) {
        const gap = it.x - (prev.x + prev.w);
        const needsSpace = gap > Math.max(0.5, it.h * 0.12) && !text.endsWith(' ') && !it.str.startsWith(' ');
        if (needsSpace) text += ' ';
      }
      text += it.str;
      prev = it;
    }
    return { text: text.replace(/\s+/g, ' ').trim(), y: row[0].y, h: Math.max(...row.map((r) => r.h)), x: row[0].x };
  });
}

/** Turns one page's items into headings and paragraphs, using line spacing and text size. */
export function pageToBlocks(items: RawItem[], bodyHeight?: number): Block[] {
  const lines = itemsToLines(items);
  if (lines.length === 0) return [];
  const body = bodyHeight ?? median(lines.map((l) => l.h));
  const blocks: Block[] = [];
  let current: Line[] = [];
  const flush = () => {
    if (current.length === 0) return;
    const text = current.map((l) => l.text).join(' ').replace(/\s+/g, ' ').trim();
    const h = Math.max(...current.map((l) => l.h));
    const short = text.length <= 120;
    let kind: Block['kind'] = 'paragraph';
    if (short && body > 0 && h >= body * 1.6) kind = 'heading1';
    else if (short && body > 0 && h >= body * 1.25) kind = 'heading2';
    if (text) blocks.push({ text, kind });
    current = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = lines[i - 1];
    if (prev) {
      const gap = prev.y - line.y;
      const sizeChanged = Math.abs(prev.h - line.h) > Math.max(prev.h, line.h) * 0.2;
      if (gap > Math.max(prev.h, line.h) * 1.7 || sizeChanged) flush();
    }
    current.push(line);
  }
  flush();
  return blocks;
}

/** Text size most common across the whole document (used so headings are judged against body text). */
export function bodyTextHeight(pages: RawItem[][]): number {
  return median(pages.flatMap((p) => p.filter((i) => i.str.trim()).map((i) => i.h)));
}

export async function blocksToDocument(pages: Block[][]) {
  // Loaded on demand so the page itself stays light until someone converts.
  const { Document, Paragraph, TextRun, HeadingLevel, PageBreak } = await import('docx');
  const children: InstanceType<typeof Paragraph>[] = [];
  pages.forEach((blocks, idx) => {
    if (idx > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    for (const b of blocks) {
      if (b.kind === 'heading1') children.push(new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_1 }));
      else if (b.kind === 'heading2') children.push(new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_2 }));
      else children.push(new Paragraph({ children: [new TextRun(b.text)], spacing: { after: 160 } }));
    }
  });
  if (children.length === 0) children.push(new Paragraph(''));
  return new Document({ creator: 'Grandmasterchess PDF to Word', sections: [{ children }] });
}

export const MAX_PDF_BYTES = 30 * 1024 * 1024;
export class PdfReadError extends Error {
  constructor(public reason: 'password' | 'invalid' | 'no-text', message: string) {
    super(message);
  }
}

interface PdfJsDocument {
  numPages: number;
  getPage(n: number): Promise<{ getTextContent(): Promise<{ items: unknown[] }> }>;
}

/** Reads every page of an opened pdf.js document into plain text items (shared by the browser and the tests). */
export async function rawPagesFromDocument(doc: PdfJsDocument, onProgress?: (done: number, total: number) => void): Promise<RawItem[][]> {
  const rawPages: RawItem[][] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    rawPages.push(
      content.items
        .filter((it): it is { str: string; transform: number[]; width: number; height: number } => typeof it === 'object' && it !== null && 'str' in it)
        .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width, h: it.height || Math.hypot(it.transform[2], it.transform[3]) }))
    );
    onProgress?.(p, doc.numPages);
  }
  return rawPages;
}

/** Browser-side: reads a PDF with pdf.js and returns text blocks per page. */
export async function extractPdfBlocks(data: ArrayBuffer, onProgress?: (done: number, total: number) => void) {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  let doc;
  try {
    doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  } catch (e) {
    const name = (e as { name?: string }).name;
    if (name === 'PasswordException') throw new PdfReadError('password', 'This PDF is password protected. Remove the password and try again.');
    throw new PdfReadError('invalid', 'This file could not be read as a PDF.');
  }
  const rawPages = await rawPagesFromDocument(doc, onProgress);
  const body = bodyTextHeight(rawPages);
  const pages = rawPages.map((items) => pageToBlocks(items, body));
  if (pages.every((b) => b.length === 0)) {
    throw new PdfReadError('no-text', 'No selectable text was found. This looks like a scanned or image-only PDF, which needs OCR (not supported here).');
  }
  return { pages, warnings: textQualityWarnings(rawPages) };
}
