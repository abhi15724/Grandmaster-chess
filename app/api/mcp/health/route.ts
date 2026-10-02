export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    name: "Grandmaster Chess MCP",
    status: "ok",
    endpoint: "/api/mcp",
    site: "https://www.grandmasterchess.in",
  });
}
