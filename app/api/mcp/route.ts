import { createMcpHandler } from "mcp-handler";
import { makeServer } from "../../../mcp-server/server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createMcpHandler(() => makeServer(), {
  serverInfo: {
    name: "grandmaster-chess",
    version: "1.0.0",
  },
});

export { handler as GET, handler as POST };
