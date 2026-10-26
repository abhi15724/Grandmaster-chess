export type PageSize = 'a4' | 'letter' | 'fit';
export type PageOrientation = 'auto' | 'portrait' | 'landscape';
export type PageMargin = 'none' | 'small' | 'medium';

export interface PreparedImage {
  bytes: Uint8Array;
  /** Encoded format of `bytes` */
  kind: 'jpg' | 'png';
  /** Pixel size after orientation has been applied */
  width: number;
  height: number;
}

export interface PdfOptions {
  size: PageSize;
  orientation: PageOrientation;
  margin: PageMargin;
}

export const DEFAULT_PDF_OPTIONS: PdfOptions = { size: 'a4', orientation: 'auto', margin: 'small' };

/** Page sizes in PDF points (1/72 inch). */
export const PAGE_POINTS = { a4: [595.28, 841.89], letter: [612, 792] } as const;
export const MARGIN_POINTS: Record<PageMargin, number> = { none: 0, small: 18, medium: 36 };
export const MAX_IMAGES = 50;
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

/** Where an image goes on a page: the page size, plus the image's box inside it. */
export function layoutImage(img: { width: number; height: number }, o: PdfOptions) {
  const m = MARGIN_POINTS[o.margin];
  if (o.size === 'fit') {
    // 96 pixels per inch on screen -> 72 points per inch in PDF.
    const w = (img.width * 72) / 96;
    const h = (img.height * 72) / 96;
    return { pageW: w + 2 * m, pageH: h + 2 * m, x: m, y: m, w, h };
  }
  const [bw, bh] = PAGE_POINTS[o.size];
  const landscape = o.orientation === 'landscape' || (o.orientation === 'auto' && img.width > img.height);
  const pageW = landscape ? bh : bw;
  const pageH = landscape ? bw : bh;
  const availW = pageW - 2 * m;
  const availH = pageH - 2 * m;
  const scale = Math.min(availW / img.width, availH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  return { pageW, pageH, x: (pageW - w) / 2, y: (pageH - h) / 2, w, h };
}

export async function buildPdfFromImages(images: PreparedImage[], options: PdfOptions = DEFAULT_PDF_OPTIONS): Promise<Uint8Array> {
  if (images.length === 0) throw new Error('Add at least one image.');
  // Loaded on demand so the page itself stays light until someone converts.
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  pdf.setProducer('Grandmasterchess image to PDF');
  pdf.setCreator('Grandmasterchess');
  for (const img of images) {
    const embedded = img.kind === 'jpg' ? await pdf.embedJpg(img.bytes) : await pdf.embedPng(img.bytes);
    const L = layoutImage(img, options);
    const page = pdf.addPage([L.pageW, L.pageH]);
    page.drawImage(embedded, { x: L.x, y: L.y, width: L.w, height: L.h });
  }
  return pdf.save();
}

/**
 * Browser-only: decodes any image the browser can read, applies EXIF rotation, and re-encodes it as JPEG
 * (photos) or PNG (PNG and GIF, which may be transparent) ready for embedding. Very large images are scaled down.
 */
export async function prepareImageFile(file: File, maxSide = 5000): Promise<PreparedImage> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error(`${file.name} is larger than 25 MB.`);
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(`${file.name} could not be read as an image. Try a JPG, PNG or WebP file.`);
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not process the image.');
  const keepsTransparency = file.type === 'image/png' || file.type === 'image/gif';
  if (!keepsTransparency) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const kind = keepsTransparency ? 'png' : 'jpg';
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, keepsTransparency ? 'image/png' : 'image/jpeg', 0.92));
  if (!blob) throw new Error('Your browser could not process the image.');
  return { bytes: new Uint8Array(await blob.arrayBuffer()), kind, width, height };
}
