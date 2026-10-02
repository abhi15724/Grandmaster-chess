# Connect Grandmaster Chess to ChatGPT

## 1. Run the MCP server locally

From the repository root:

    cd mcp-server
    npm install
    npm start

Check:

    http://localhost:8787/

The MCP endpoint is:

    http://localhost:8787/mcp

## 2. Give ChatGPT an HTTPS endpoint

ChatGPT cannot directly reach a localhost-only server. During development, expose port 8787 through an HTTPS tunnel such as ngrok.

The public endpoint should look like:

    https://YOUR-TUNNEL-DOMAIN/mcp

Do not commit tunnel credentials or API keys.

## 3. Connect it in ChatGPT

In a ChatGPT workspace/account where Developer Mode or MCP app connections are available, add a remote MCP server using the HTTPS /mcp endpoint.

The available tools should appear as:

- Search Grandmaster Chess
- Get a Grandmaster Chess Article
- Find a Chess Opening
- Get Chess Rules
- Get a Chess Puzzle

## 4. Production deployment

Deploy mcp-server as a separate Node service with Node 20+ and HTTPS. Set:

    SITE_URL=https://www.grandmasterchess.in

The service must expose:

    /mcp

Do not expose Supabase service-role keys, GitHub tokens, user passwords, or payment credentials to this read-only server.

## 5. Next phase

After this read-only version is tested, add an MCP App UI for an interactive chess board. Authenticated game/training actions should be introduced separately with authorization and confirmation.

## Interactive chess board

The server now includes an MCP-compatible board asset at `public/chess-board.html` and game tools:

- `new_chess_game`
- `get_chess_game`
- `get_legal_chess_moves`
- `make_chess_move`

The board is intentionally session/in-memory based in this first version. Restarting the MCP server removes active games. There is no account persistence yet.

The next production step is to register the board as an MCP App UI resource using the current OpenAI Apps SDK/MCP Apps resource pattern, then deploy the MCP server over HTTPS.


## Coaching and analysis

The MCP server now provides:

- `analyze_chess_position` — engine evaluation and principal variation for a FEN.
- `coach_chess_move` — compares a played move with the engine recommendation and classifies it as good, inaccuracy, mistake, or blunder when centipawn data is available.
- `analyze_chess_game` — reviews recorded moves and returns a post-game issue summary.

The board's **Analyze** button calls the full-game analyzer. Engine labels depend on search depth and should be treated as training guidance.
