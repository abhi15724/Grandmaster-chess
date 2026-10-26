'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Download, FilePlus2, Trash2 } from 'lucide-react';
import {
  DEFAULT_PDF_OPTIONS,
  MAX_IMAGES,
  buildPdfFromImages,
  prepareImageFile,
  type PageMargin,
  type PageOrientation,
  type PageSize,
  type PdfOptions,
  type PreparedImage,
} from '@/lib/pdf-images';
import { formatBytes } from '@/lib/converter';

interface Item {
  id: number;
  name: string;
  previewUrl: string;
  image: PreparedImage;
}

const field = 'rounded-lg border border-[#3c3934] bg-[#262421] px-3 py-2 text-sm text-zinc-100 focus:border-[#81b64c] focus:outline-none';
const small = 'inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#3c3934] bg-[#262421] text-zinc-300 hover:border-[#81b64c]/60 disabled:opacity-30';

export const ImageToPdf: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [options, setOptions] = useState<PdfOptions>(DEFAULT_PDF_OPTIONS);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; pages: number } | null>(null);
  const nextId = useRef(1);
  const urls = useRef<string[]>([]);

  // Release object URLs when leaving the page.
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const clearResult = () => {
    setResult((r) => {
      if (r) URL.revokeObjectURL(r.url);
      return null;
    });
  };

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
    const room = MAX_IMAGES - items.length;
    const problems: string[] = [];
    if (list.length < Array.from(files).length) problems.push('Some files were skipped because they are not images.');
    if (list.length > room) problems.push(`You can add up to ${MAX_IMAGES} images; extra files were skipped.`);
    setBusy(true);
    clearResult();
    const added: Item[] = [];
    for (const file of list.slice(0, Math.max(0, room))) {
      try {
        const image = await prepareImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        urls.current.push(previewUrl);
        added.push({ id: nextId.current++, name: file.name, previewUrl, image });
      } catch (e) {
        problems.push(e instanceof Error ? e.message : `${file.name} could not be added.`);
      }
    }
    setItems((cur) => [...cur, ...added]);
    setErrors(problems);
    setBusy(false);
  };

  const move = (i: number, d: -1 | 1) => {
    clearResult();
    setItems((cur) => {
      const next = [...cur];
      const j = i + d;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const remove = (id: number) => {
    clearResult();
    setItems((cur) => cur.filter((x) => x.id !== id));
  };

  const convert = async () => {
    setBusy(true);
    setErrors([]);
    clearResult();
    try {
      const bytes = await buildPdfFromImages(items.map((i) => i.image), options);
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages: items.length });
    } catch (e) {
      setErrors([e instanceof Error ? e.message : 'The PDF could not be created.']);
    } finally {
      setBusy(false);
    }
  };

  const set = <K extends keyof PdfOptions>(k: K, v: PdfOptions[K]) => {
    clearResult();
    setOptions((o) => ({ ...o, [k]: v }));
  };

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6">
      <label
        htmlFor="img-files"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void addFiles(e.dataTransfer.files); }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3c3934] bg-[#161512] px-4 py-8 text-center hover:border-[#81b64c]/60"
      >
        <FilePlus2 className="mb-2 h-6 w-6 text-[#81b64c]" />
        <span className="text-sm font-semibold text-zinc-100">Choose images or drop them here</span>
        <span className="mt-1 text-xs text-zinc-500">JPG, PNG, WebP, GIF or BMP. Up to {MAX_IMAGES} images, 25 MB each.</span>
        <input id="img-files" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ''; }} />
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 list-disc space-y-1 rounded-lg border border-[#3c3934] bg-[#161512] p-3 pl-6 text-xs text-zinc-300">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}

      {items.length > 0 && (
        <>
          <ol className="mt-4 grid gap-2" aria-label="Images in page order">
            {items.map((it, i) => (
              <li key={it.id} className="flex items-center gap-3 rounded-lg border border-[#3c3934] bg-[#161512] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.previewUrl} alt="" className="h-12 w-12 rounded object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">{i + 1}. {it.name}</span>
                <button type="button" className={small} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${it.name} up`}><ArrowUp className="h-4 w-4" /></button>
                <button type="button" className={small} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${it.name} down`}><ArrowDown className="h-4 w-4" /></button>
                <button type="button" className={small} onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ol>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Page size
              <select className={`${field} mt-1 block w-full`} value={options.size} onChange={(e) => set('size', e.target.value as PageSize)}>
                <option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Same as image</option>
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Orientation
              <select className={`${field} mt-1 block w-full`} value={options.orientation} onChange={(e) => set('orientation', e.target.value as PageOrientation)} disabled={options.size === 'fit'}>
                <option value="auto">Automatic</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option>
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Margin
              <select className={`${field} mt-1 block w-full`} value={options.margin} onChange={(e) => set('margin', e.target.value as PageMargin)}>
                <option value="none">None</option><option value="small">Small</option><option value="medium">Medium</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={convert} disabled={busy} className="rounded-lg bg-[#81b64c] px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-[#70a33e] disabled:opacity-50">
              {busy ? 'Working...' : `Create PDF (${items.length} ${items.length === 1 ? 'page' : 'pages'})`}
            </button>
            {result && (
              <a href={result.url} download="images.pdf" className="inline-flex items-center gap-2 rounded-lg border border-[#81b64c] px-4 py-3 text-sm font-bold text-[#81b64c] hover:bg-[#81b64c]/10">
                <Download className="h-4 w-4" /> Download PDF ({formatBytes(result.size)})
              </a>
            )}
          </div>
          <p className="mt-3 text-[11px] text-zinc-500">Your images are processed in this browser and are not uploaded.</p>
        </>
      )}
    </div>
  );
};
