$ErrorActionPreference='Stop'
Write-Host '=== Grandmaster AI HQ setup ===' -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js is required.' }
if (-not (Get-Command python -ErrorAction SilentlyContinue)) { throw 'Python is required.' }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is required.' }
Set-Location $PSScriptRoot
npm install
Write-Host 'Setup complete. Set OPENROUTER_API_KEY, then run npm start.' -ForegroundColor Green
