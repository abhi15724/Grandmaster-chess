$ErrorActionPreference='Stop'
if (-not $env:OPENROUTER_API_KEY) { Write-Host 'OPENROUTER_API_KEY is not set.' -ForegroundColor Yellow; Write-Host '$env:OPENROUTER_API_KEY="YOUR_KEY"' -ForegroundColor Yellow; exit 1 }
if (-not $env:AI_MODEL) { $env:AI_MODEL='openrouter/free' }
Set-Location $PSScriptRoot
npm start
