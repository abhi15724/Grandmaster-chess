import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["@se-oss/stockfish", "@modelcontextprotocol/server", "@modelcontextprotocol/ext-apps", "mcp-handler"],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/play', destination: '/play/ai', permanent: true },
      { source: '/learn/rules', destination: '/learn/chess-rules', permanent: true },
      { source: '/learn/openings', destination: '/learn/chess-openings', permanent: true },
      { source: '/learn/strategies', destination: '/learn/chess-strategies', permanent: true },
      { source: '/learn/how-to-play-chess', destination: '/learn/chess-rules', permanent: true },
      // Old / truncated slugs that Search Console shows with impressions -> the canonical article.
      ...[
        'how-many-possible-chess-games-are-there',
        'how-many-possible-chess-games-are-the',
        'how-many-possible-chess-games-are-the-actual-math',
        'how-many-possible-chess-games-are-there-the-actual-math',
        'how-many-possible-chess-games-are-type',
        'how-possible-chess-games',
        'how-possible-chess-games-are-there',
      ].map((slug) => ({
        source: `/blog/${slug}`,
        destination: '/blog/how-many-possible-chess-games',
        permanent: true,
      })),
      // Listicle URL that earns clicks in Search Console but has no page of its own (the replacement listicle is held back while unverified).
      { source: '/blog/best-chess-websites-2026', destination: '/blog', permanent: true },
      // Self-promotional guide merged into the homepage.
      { source: '/blog/play-chess-online-grandmaster-chess', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
