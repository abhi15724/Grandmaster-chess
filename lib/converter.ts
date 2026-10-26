/**
 * Word/PowerPoint to PDF run on a separate conversion service (see /converter), because LibreOffice cannot run on
 * the serverless host. The tools are only offered when NEXT_PUBLIC_CONVERTER_URL is set, so a broken tool is never shown.
 */
export const CONVERTER_URL = (process.env.NEXT_PUBLIC_CONVERTER_URL ?? '').trim().replace(/\/+$/, '');
export const converterEnabled = CONVERTER_URL.length > 0;
export const MAX_UPLOAD_MB = 25;

export type OfficeKind = 'word' | 'ppt';
const EXT: Record<OfficeKind, string[]> = { word: ['docx', 'doc'], ppt: ['pptx', 'ppt'] };

export function officeType(fileName: string, kind: OfficeKind): string | null {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXT[kind].includes(ext) ? ext : null;
}

export function outputName(fileName: string, ext: string): string {
  const base = fileName.replace(/\.[^./\\]+$/, '').replace(/[^\w\- .()]+/g, '_').trim() || 'converted';
  return `${base}.${ext}`;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}
