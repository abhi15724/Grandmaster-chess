# Grandmaster AI HQ

Local Windows desktop command center for the Grandmaster Chess growth team.

Prerequisites: Node.js 20+, Python 3.11+, Git, GitHub CLI (gh), and an OpenRouter API key.

Run from the repository root:
cd desktop
npm install
npm start

PowerShell before launching:
$env:OPENROUTER_API_KEY="YOUR_KEY"
$env:AI_MODEL="openrouter/free"

The runtime refuses a dirty Git tree, creates an isolated branch, runs lint and build, and only then attempts a GitHub PR. It never edits main directly.
