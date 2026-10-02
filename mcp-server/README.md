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
