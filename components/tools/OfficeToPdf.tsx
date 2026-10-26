'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, FileUp } from 'lucide-react';
import { CONVERTER_URL, MAX_UPLOAD_MB, formatBytes, officeType, outputName, type OfficeKind } from '@/lib/converter';

const COPY: Record<OfficeKind, { accept: string; label: string; formats: string }> = {
  word: { accept: '.docx,.doc', label: 'a Word document', formats: 'DOCX or DOC' },
  ppt: { accept: '.pptx,.ppt', label: 'a PowerPoint presentation', formats: 'PPTX or PPT' },
};

export const OfficeToPdf: React.FC<{ kind: OfficeKind; converterUrl?: string }> = ({ kind, converterUrl = CONVERTER_URL }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const lastUrl = useRef<string | null>(null);
  useEffect(() => () => { if (lastUrl.current) URL.revokeObjectURL(lastUrl.current); }, []);

  const convert = async (file: File) => {
    setError(null);
    setResult(null);
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    const type = officeType(file.name, kind);
    if (!type) return setError(`Please choose a ${COPY[kind].formats} file.`);
    if (file.size > MAX_UPLOAD_MB * 1048576) return setError(`That file is ${formatBytes(file.size)}. The limit is ${MAX_UPLOAD_MB} MB.`);
    setBusy(true);
    try {
      let res: Response;
      try {
        res = await fetch(`${converterUrl}/convert?type=${type}`, { method: 'POST', body: file, headers: { 'Content-Type': 'application/octet-stream' } });
      } catch {
        throw new Error('The converter could not be reached. Please try again in a moment.');
      }
      if (!res.ok) {
        const message = await res.json().then((j: { error?: string }) => j.error).catch(() => undefined);
        throw new Error(message || 'The conversion failed. Please try again.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      lastUrl.current = url;
      setResult({ url, name: outputName(file.name, 'pdf'), size: blob.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The conversion failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#3c3934] bg-[#1e1c19] p-4 sm:p-6">
      <label
        htmlFor="office-file"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void convert(f); }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3c3934] bg-[#161512] px-4 py-8 text-center hover:border-[#81b64c]/60"
      >
        <FileUp className="mb-2 h-6 w-6 text-[#81b64c]" />
        <span className="text-sm font-semibold text-zinc-100">Choose {COPY[kind].label} or drop it here</span>
        <span className="mt-1 text-xs text-zinc-500">{COPY[kind].formats}, up to {MAX_UPLOAD_MB} MB.</span>
        <input id="office-file" type="file" accept={COPY[kind].accept} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void convert(f); e.target.value = ''; }} />
      </label>
      {busy && <p role="status" className="mt-4 text-sm text-zinc-300">Converting. This usually takes a few seconds...</p>}
      {error && <p role="alert" className="mt-4 rounded-lg border border-[#3c3934] bg-[#161512] p-3 text-sm text-zinc-300">{error}</p>}
      {result && (
        <a href={result.url} download={result.name} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#81b64c] px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-[#70a33e]">
          <Download className="h-4 w-4" /> Download {result.name} ({formatBytes(result.size)})
        </a>
      )}
      <p className="mt-4 text-[11px] text-zinc-500">Your file is sent to our conversion service, converted, and deleted immediately. It is never stored.</p>
    </div>
  );
};
