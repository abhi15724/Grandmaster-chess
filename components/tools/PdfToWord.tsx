'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, FileUp } from 'lucide-react';
import { MAX_PDF_BYTES, PdfReadError, blocksToDocument, extractPdfBlocks } from '@/lib/pdf-text';
import { formatBytes, outputName } from '@/lib/converter';

export const PdfToWord: React.FC = () => {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [result, setResult] = useState<{ url: string; name: string; size: number; pages: number } | null>(null);
  const lastUrl = useRef<string | null>(null);

  useEffect(() => () => { if (lastUrl.current) URL.revokeObjectURL(lastUrl.current); }, []);

  const convert = async (file: File) => {
    setError(null);
    setWarnings([]);
    setResult(null);
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') return setError('Please choose a PDF file.');
    if (file.size > MAX_PDF_BYTES) return setError(`That file is ${formatBytes(file.size)}. The limit is 30 MB.`);
    setBusy(true);
    try {
      const { pages, warnings: w } = await extractPdfBlocks(await file.arrayBuffer(), (d, t) => setProgress(`Reading page ${d} of ${t}...`));
      setProgress('Building the Word file...');
      const { Packer } = await import('docx');
      const blob = await Packer.toBlob(await blocksToDocument(pages));
      const url = URL.createObjectURL(blob);
      lastUrl.current = url;
      setWarnings(w);
      setResult({ url, name: outputName(file.name, 'docx'), size: blob.size, pages: pages.length });
    } catch (e) {
      setError(e instanceof PdfReadError ? e.message : 'Something went wrong while reading this PDF.');
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6">
      <label
        htmlFor="pdf-file"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void convert(f); }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3c3934] bg-[#161512] px-4 py-8 text-center hover:border-[#81b64c]/60"
      >
        <FileUp className="mb-2 h-6 w-6 text-[#81b64c]" />
        <span className="text-sm font-semibold text-zinc-100">Choose a PDF or drop it here</span>
        <span className="mt-1 text-xs text-zinc-500">Text-based PDFs up to 30 MB. Converted in your browser.</span>
        <input id="pdf-file" type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void convert(f); e.target.value = ''; }} />
      </label>

      {busy && <p role="status" className="mt-4 text-sm text-zinc-300">{progress || 'Working...'}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg border border-[#3c3934] bg-[#161512] p-3 text-sm text-zinc-300">{error}</p>}
      {warnings.map((w) => <p key={w} role="note" className="mt-4 rounded-lg border border-[#e8c547]/40 bg-[#161512] p-3 text-sm text-zinc-300">{w}</p>)}

      {result && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href={result.url} download={result.name} className="inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-[#70a33e]">
            <Download className="h-4 w-4" /> Download {result.name} ({formatBytes(result.size)})
          </a>
          <span className="text-xs text-zinc-500">{result.pages} {result.pages === 1 ? 'page' : 'pages'} of text</span>
        </div>
      )}
      <p className="mt-4 text-[11px] text-zinc-500">Text and headings are converted. Images, tables and exact layout are not carried over. Your file is not uploaded.</p>
    </div>
  );
};
