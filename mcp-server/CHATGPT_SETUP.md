# Connect Grandmaster Chess to ChatGPT

## Production MCP endpoint

The Grandmaster Chess website is deployed on Vercel. The MCP server is now mounted inside the same Next.js application.

- Website: https://www.grandmasterchess.in
- MCP endpoint: https://www.grandmasterchess.in/api/mcp
- Health check: https://www.grandmasterchess.in/api/mcp/health

No separate Render service is required for the production MCP endpoint.

## ChatGPT connection

Use the production HTTPS MCP endpoint in a ChatGPT environment that supports remote MCP apps/connections:

    https://www.grandmasterchess.in/api/mcp

The server exposes:

- Search Grandmaster Chess content
- Get a Grandmaster Chess article
- Find chess openings
- Get chess rules
- Get chess puzzles
- Start and play chess games
- Play against Grandmaster AI
- Analyze positions
- Coach individual moves
- Analyze recorded games
- Render an interactive MCP chessboard

## Vercel configuration

The route is:

    app/api/mcp/route.ts

It uses Vercel's Web-standard MCP handler and Node.js runtime. The route is stateless at the MCP transport layer.

The chess game implementation currently keeps active games in process memory. On a serverless cold start or instance change, an in-progress game may no longer be available. Persistent authenticated games should be backed by Supabase in a later phase.

## Local development

Run the normal Next.js application from the repository root:

    npm install
    npm run dev

Then the MCP endpoint is:

    http://localhost:3000/api/mcp

For a remote MCP client, expose the local Next.js server through an HTTPS development tunnel.

## Security

Do not commit Supabase service-role keys, GitHub tokens, passwords, payment credentials, or other secrets. The MCP endpoint currently does not expose those credentials.

## Engine licensing

Grandmaster AI uses Stockfish through `@se-oss/stockfish`. Review the dependency's GPL-3.0 licensing obligations before commercial redistribution.
