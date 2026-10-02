import type { NextConfig } from "next";

const nextConfig: NextConfig = {\n  serverExternalPackages: ["@se-oss/stockfish", "@modelcontextprotocol/server", "@modelcontextprotocol/ext-apps", "mcp-handler"],
  async redirects() {
    return [
      { source: '/play', destination: '/play/ai', permanent: true },
      { source: '/learn/rules', destination: '/learn/chess-rules', permanent: true },
      { source: '/learn/openings', destination: '/learn/chess-openings', permanent: true },
      { source: '/learn/strategies', destination: '/learn/chess-strategies', permanent: true },
      { source: '/learn/how-to-play-chess', destination: '/learn/chess-rules', permanent: true },
    ];
  },
};

export default nextConfig;
