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
