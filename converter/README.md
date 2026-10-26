# Document converter service (Word and PowerPoint to PDF)

A small Node service that runs LibreOffice. The website calls it directly from the visitor's browser, because the web host
(for example Vercel) cannot run LibreOffice and limits request sizes. Without this service the Word to PDF and PowerPoint to PDF pages
stay hidden (noindexed, not in the sitemap, not in the tools list), so visitors never see a broken tool.

## What it does
- `POST /convert?type=docx|doc|pptx|ppt` with the raw file as the request body returns the PDF (`application/pdf`).
- `GET /health` returns `{"ok":true}`.
- Each file is converted in a private temporary folder that is deleted straight away. Nothing is stored, and file names are never used or logged.

## Safety limits (all configurable)
| Variable | Default | Purpose |
|---|---|---|
| `ALLOWED_ORIGINS` | `https://www.grandmasterchess.in` | Comma-separated sites allowed to call the service (CORS and Origin check). Requests from anywhere else get 403. |
| `MAX_UPLOAD_MB` | `25` | Largest accepted file (413 above it). |
| `MAX_CONCURRENT` | `2` | Conversions at once; extra requests get 503 with `Retry-After`. |
| `RATE_PER_MIN` | `10` | Requests per IP per minute (429 above it). |
| `CONVERT_TIMEOUT_MS` | `60000` | A conversion that runs longer is killed (504). |
| `PORT` | `8080` | Listening port. |

Files are checked before conversion: the type must match the file's real signature (a text file renamed `.docx` is refused with 415).

## Deploy
1. Build and run the image on any Docker host (Render, Fly.io, Google Cloud Run, a VPS):
   ```
   docker build -t gmc-converter converter/
   docker run -p 8080:8080 -e ALLOWED_ORIGINS=https://www.grandmasterchess.in gmc-converter
   ```
   LibreOffice is memory-hungry. Start with 1 to 2 GB of RAM and watch usage; raise `MAX_CONCURRENT` only if memory allows.
2. Put it behind HTTPS, for example `https://convert.grandmasterchess.in`.
3. In the website's hosting settings (Vercel project, Environment Variables) set
   `NEXT_PUBLIC_CONVERTER_URL=https://convert.grandmasterchess.in` and **redeploy** (the value is read at build time).
4. Open `/tools/word-to-pdf` and `/tools/ppt-to-pdf`, convert a real file of each, and check the PDFs.

## Tested and not tested
- Tested here with a real LibreOffice 24.2 (`service-test.mjs`): DOCX and PPTX conversion, Hindi text, bad or mismatched files, corrupted files,
  disallowed origins, oversize uploads, rate limiting, the concurrency cap and temp-folder cleanup.
- **Not tested:** the Docker image itself (no Docker in the build environment), and Debian's LibreOffice (version 7.4 in this image) rather than 24.2. Layout can differ slightly between versions, so check a few of your own documents.
