# Grandmaster Chess MCP Server

Read-only MCP server for GrandmasterChess.in.

Tools:
- search_chess_content
- get_chess_article
- find_opening
- get_chess_rules
- get_chess_puzzle

## Local setup

cd mcp-server
npm install
npm start

Health: http://localhost:8787/
MCP: http://localhost:8787/mcp

For ChatGPT development, expose the local server through an HTTPS tunnel and connect the public /mcp URL in ChatGPT Developer Mode.

This first version exposes no account, payment, write, or GitHub credentials.


## Play against Grandmaster AI

The MCP App includes a chessboard for human-vs-engine play.

- Human plays White.
- Grandmaster AI plays Black.
- Difficulty: Beginner, Intermediate, Advanced, Master.
- Legal moves are validated with chess.js.
- Engine analysis uses Stockfish WASM through `@se-oss/stockfish`.
- Game state is currently in memory and is not tied to a user account.

### AI tools

- `start_ai_chess_game`
- `play_chess_vs_ai`
- `get_chess_game`
- `get_legal_chess_moves`

The Stockfish wrapper is GPL-3.0 licensed; review its license obligations before commercial distribution or redistribution of the software.