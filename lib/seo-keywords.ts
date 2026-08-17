/**
 * Centralized SEO + AEO keyword bank.
 *
 * Note: the meta `keywords` tag itself carries no ranking weight with Google
 * (Google has ignored it since 2009) and AI answer engines rely far more on
 * page titles, headings, on-page copy, and structured data (see lib/json-ld.ts)
 * than on this tag. We still populate it because Bing and some AI crawlers
 * read it as a mild relevance signal, and — more importantly — keeping a
 * single curated list here keeps every page's title/description/keyword
 * targeting consistent and easy to update in one place.
 *
 * Each export below is a short, page-relevant set (not a keyword-stuffed
 * dump of the entire research list) to avoid diluting relevance signals.
 */

export const BRAND_KEYWORDS = [
  'grandmaster chess',
  'grandmasterchess',
  'grandmaster chess online',
  'grandmaster chess online games',
  'play grandmaster chess online',
  'grandmaster chess game',
  'grandmasterchess.in',
];

export const SITE_KEYWORDS = [
  ...BRAND_KEYWORDS,
  'play chess online',
  'online chess',
  'chess online',
  'chess game online',
  'free online chess',
  'play chess against computer',
  'play chess vs ai',
  'chess app',
  'chess website',
  'chess without registration',
  'chess no sign up',
  'Chess',
];

export const HOME_KEYWORDS = [
  ...BRAND_KEYWORDS,
  'play chess online free',
  'play chess vs computer',
  'play chess against ai',
  'online chess game',
  'pass and play chess',
  'chess without registration',
  'chess no sign up',
];

export const PLAY_AI_KEYWORDS = [
  'play chess vs ai',
  'play chess against computer',
  'chess ai opponent',
  'free chess ai',
  'chess bot online',
  'grandmaster chess ai',
  'grandmaster chess online games',
  'chess engine online',
];

export const PLAY_AI_BASIC_KEYWORDS = [
  'play chess vs easy ai',
  'beginner chess ai',
  'chess for beginners online',
  'learn chess against ai',
  'grandmaster chess beginner mode',
];

export const PLAY_AI_INTERMEDIATE_KEYWORDS = [
  'play chess vs intermediate ai',
  'casual chess ai',
  'medium difficulty chess ai',
  'grandmaster chess intermediate ai',
];

export const PLAY_AI_ADVANCED_KEYWORDS = [
  'play chess vs advanced ai',
  'hardest chess ai',
  'master level chess ai',
  'strongest free chess engine online',
  'grandmaster chess advanced ai',
];

export const PLAY_LOCAL_KEYWORDS = [
  '2 player chess online',
  'pass and play chess',
  'local chess same device',
  'offline chess two players',
  'play chess against yourself',
  'grandmaster chess local mode',
];

export const LEARN_OPENINGS_KEYWORDS = [
  'chess openings for beginners',
  'best chess openings',
  'sicilian defense',
  'ruy lopez opening',
  'italian game chess',
  "queen's gambit",
  'london system',
  'caro-kann defense',
  'best opening for white',
  'best opening for black',
];

export const LEARN_RULES_KEYWORDS = [
  'how to play chess',
  'chess rules for beginners',
  'how does castling work in chess',
  'en passant rule explained',
  'chess piece values',
  'chess notation explained',
  'algebraic notation chess',
  'what is a stalemate',
];

export const LEARN_STRATEGY_KEYWORDS = [
  'chess tactics guide',
  'chess strategy for beginners',
  'what is a fork in chess',
  'what is a pin in chess',
  'chess endgame basics',
  'how to improve at chess',
  'how to checkmate fast',
];

export const FAQ_KEYWORDS = [
  ...BRAND_KEYWORDS,
  'chess rating system explained',
  'elo rating chess',
  'how does the chess ai engine work',
  'is online chess rating the same as fide',
  'chess faq',
];

export const BLOG_KEYWORDS = [
  'chess blog',
  'chess strategy guide',
  'chess openings guide',
  'chess tactics guide',
  'how to beat chess ai',
  'grandmaster chess blog',
];
