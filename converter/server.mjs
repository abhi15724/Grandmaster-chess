// Grandmasterchess document converter: Word/PowerPoint to PDF using LibreOffice.
// Zero dependencies. Files are processed in a private temp folder and deleted immediately; nothing is stored or logged by name.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const PORT = Number(process.env.PORT || 8080);
const MAX_BYTES = Number(process.env.MAX_UPLOAD_MB || 25) * 1024 * 1024;
const MAX_CONCURRENT = Number(process.env.MAX_CONCURRENT || 2);
const RATE_PER_MIN = Number(process.env.RATE_PER_MIN || 10);
const TIMEOUT_MS = Number(process.env.CONVERT_TIMEOUT_MS || 60_000);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://www.grandmasterchess.in')
  .split(',').map((s) => s.trim()).filter(Boolean);
const ALLOW_ANY_ORIGIN = process.env.ALLOW_ANY_ORIGIN === '1'; // for local testing only
const TMP_PREFIX = 'gmc-conv-';

const ZIP = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const OLE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
// type -> { ext, magic, marker found in a zip's file names }
const TYPES = {
  docx: { magic: ZIP, marker: 'word/' },
  pptx: { magic: ZIP, marker: 'ppt/' },
  doc: { magic: OLE },
  ppt: { magic: OLE },
};

let active = 0;
const hits = new Map(); // ip -> timestamps in the last minute

function clientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket.remoteAddress || 'unknown';
}
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60_000)) hits.delete(k);
  return list.length > RATE_PER_MIN;
}

function cors(req, res) {
  const origin = req.headers.origin;
  const ok = !!origin && (ALLOW_ANY_ORIGIN || ALLOWED_ORIGINS.includes(origin));
  if (ok) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '600');
  }
  return ok;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(body);
}
const fail = (res, status, error, extra = {}) =>
  send(res, status, JSON.stringify({ error }), { 'Content-Type': 'application/json', ...extra });

function readBody(req) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers['content-length'] || 0);
    if (declared > MAX_BYTES) return reject(Object.assign(new Error('too large'), { code: 413 }));
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BYTES) {
        reject(Object.assign(new Error('too large'), { code: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function looksRight(type, buf) {
  const spec = TYPES[type];
  if (buf.length < 16 || !buf.subarray(0, spec.magic.length).equals(spec.magic)) return false;
  if (spec.marker) {
    // File names inside a zip are stored uncompressed in its headers.
    const head = buf.toString('latin1');
    if (!head.includes(spec.marker)) return false;
  }
  return true;
}

function runSoffice(dir, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'soffice',
      ['--headless', '--norestore', '--nolockcheck', '--nodefault', '--nologo',
       `-env:UserInstallation=file://${dir}/profile`, '--convert-to', 'pdf', '--outdir', dir, input],
      { stdio: 'ignore', cwd: dir }
    );
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(Object.assign(new Error('timeout'), { code: 504 })); }, TIMEOUT_MS);
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('exit', (code) => { clearTimeout(timer); code === 0 ? resolve() : reject(Object.assign(new Error('soffice failed'), { code: 422 })); });
  });
}

async function convert(type, buf) {
  const dir = await mkdtemp(path.join(os.tmpdir(), TMP_PREFIX));
  try {
    const input = path.join(dir, `input.${type}`);
    await writeFile(input, buf);
    await runSoffice(dir, input);
    const pdf = await readFile(path.join(dir, 'input.pdf')).catch(() => null);
    if (!pdf || pdf.length < 100 || pdf.subarray(0, 4).toString() !== '%PDF') {
      throw Object.assign(new Error('no output'), { code: 422 });
    }
    return pdf;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, JSON.stringify({ ok: true }), { 'Content-Type': 'application/json' });

  if (url.pathname !== '/convert') return fail(res, 404, 'Not found');
  const originOk = cors(req, res);
  if (req.method === 'OPTIONS') return originOk ? send(res, 204, '') : fail(res, 403, 'Origin not allowed');
  if (req.method !== 'POST') return fail(res, 405, 'Use POST');
  if (!originOk) return fail(res, 403, 'Origin not allowed');

  const type = url.searchParams.get('type') || '';
  if (!Object.hasOwn(TYPES, type)) return fail(res, 400, 'type must be docx, pptx, doc or ppt');
  if (rateLimited(clientIp(req))) return fail(res, 429, 'Too many conversions. Please wait a minute.', { 'Retry-After': '60' });
  if (active >= MAX_CONCURRENT) return fail(res, 503, 'The converter is busy. Please try again in a few seconds.', { 'Retry-After': '5' });

  active++;
  try {
    const body = await readBody(req);
    if (!looksRight(type, body)) return fail(res, 415, `That file does not look like a valid .${type} file.`);
    const started = Date.now();
    const pdf = await convert(type, body);
    console.log(`ok type=${type} in=${body.length}B out=${pdf.length}B ms=${Date.now() - started}`);
    send(res, 200, pdf, {
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdf.length),
      'Content-Disposition': 'attachment; filename="converted.pdf"',
    });
  } catch (e) {
    const code = e && e.code;
    if (code === 413) return fail(res, 413, `File too large (limit ${Math.round(MAX_BYTES / 1048576)} MB).`);
    if (code === 504) return fail(res, 504, 'The conversion took too long and was stopped.');
    if (code === 422) return fail(res, 422, 'The file could not be converted. It may be corrupted or password protected.');
    console.log(`error ${e && e.message}`);
    return fail(res, 500, 'Conversion failed.');
  } finally {
    active--;
  }
});

server.requestTimeout = 120_000;
server.headersTimeout = 20_000;
server.listen(PORT, () => console.log(`converter listening on ${PORT}`));
