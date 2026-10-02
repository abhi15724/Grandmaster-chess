# Grandmaster Chess MCP

MCP integration for GrandmasterChess.in, deployed with the website's Next.js/Vercel application.

## Production

- Website: https://www.grandmasterchess.in
- MCP: https://www.grandmasterchess.in/api/mcp
- Health: https://www.grandmasterchess.in/api/mcp/health

## Tools

- `search_chess_content`
- `get_chess_article`
- `find_opening`
- `get_chess_rules`
- `get_chess_puzzle`
- `new_chess_game`
- `get_chess_game`
- `get_legal_chess_moves`
- `make_chess_move`
- `start_ai_chess_game`
- `play_chess_vs_ai`
- `analyze_chess_position`
- `coach_chess_move`
- `analyze_chess_game`

## MCP App UI

The interactive board is registered as:

    ui://widget/chess-board.html

The UI supports human-vs-AI play, legal move highlighting, difficulty selection, and post-game analysis.

## Local development

From the repository root:

    npm install
    npm run dev

MCP endpoint:

    http://localhost:3000/api/mcp

## State

MCP transport is stateless. Active chess games currently use process memory, so persistent games are not guaranteed across Vercel instance changes. Supabase-backed game persistence is the next production-hardening step.

## Licensing

The Stockfish wrapper `@se-oss/stockfish` is GPL-3.0 licensed. Review its license obligations before commercial distribution or redistribution.
