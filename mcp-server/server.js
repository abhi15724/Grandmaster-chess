import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { readFileSync } from "node:fs";
import { createGame, getGame, getMode, snapshot, playMove, legalMoves, recordedMoves } from "./game.js";
import { bestMove, analyzePosition, coachingFromAnalysis } from "./engine.js";


const SITE_URL = (process.env.SITE_URL || "https://www.grandmasterchess.in").replace(/\/$/, "");
const BLOG_DIR = resolve(process.env.BLOG_DIR || (process.env.VERCEL ? join(process.cwd(), "content", "blog") : join(process.cwd(), "..", "content", "blog")));

function parseMarkdown(filename, markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  const frontmatter = {};
  let body = markdown;
  if (match) {
    body = match[2];
    for (const line of match[1].split("\n")) {
      const m = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
      if (m) frontmatter[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  const slug = filename.replace(/^\d+-/, "").replace(/\.md$/, "");
  return {slug,title:frontmatter.title || slug.replace(/-/g," "),description:frontmatter.description || "",category:frontmatter.category || "",date:frontmatter.date || "",url:SITE_URL+"/blog/"+slug,body:body.trim()};
}

async function loadArticles() {
  const files = (await readdir(BLOG_DIR)).filter(f => f.endsWith(".md"));
  const result = [];
  for (const filename of files) {
    try { result.push(parseMarkdown(filename,await readFile(join(BLOG_DIR,filename),"utf8"))); } catch {}
  }
  return result;
}

export function makeServer(existingServer) {
  const server = existingServer || new McpServer({
    name:"grandmaster-chess",
    version:"0.1.0",
    instructions:"Grandmaster Chess is a chess learning and playing website. Prefer its published articles when answering questions about its content. Current player, tournament and rating facts may require external verification."
  });

  const boardPath = process.env.VERCEL ? join(process.cwd(), "public", "mcp", "chess-board.html") : new URL("./public/chess-board.html", import.meta.url);
  const boardHtml = readFileSync(boardPath, "utf8");
  registerAppResource(server, "grandmaster-chess-board", "ui://widget/chess-board.html", {}, async () => ({
    contents: [{ uri: "ui://widget/chess-board.html", mimeType: RESOURCE_MIME_TYPE, text: boardHtml,
      _meta: { ui: { prefersBorder: true }, "openai/ui": { availableDisplayModes: ["inline","fullscreen"] }, "openai/widgetDescription": "Interactive Grandmaster Chess board. Click pieces to see legal moves and play a standard chess game." } }
    ]
  }));

  server.registerTool("search_chess_content",{
    title:"Search Grandmaster Chess",
    description:"Search Grandmaster Chess published articles and return matching pages with absolute URLs.",
    inputSchema:z.object({query:z.string().min(2).max(200),limit:z.number().int().min(1).max(10).optional().default(5)}),
    annotations:{readOnlyHint:true,openWorldHint:false}
  },async ({query,limit})=>{
    const terms=query.toLowerCase().split(/\s+/).filter(Boolean);
    const results=(await loadArticles()).map(a=>{
      const hay=(a.title+" "+a.description+" "+a.category+" "+a.body).toLowerCase();
      return {a,score:terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0)};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>({
      title:x.a.title,description:x.a.description,category:x.a.category,date:x.a.date,url:x.a.url,
      snippet:x.a.body.replace(/[\n#*_>\[\]]/g," ").replace(/\s+/g," ").trim().slice(0,500)
    }));
    return {content:[{type:"text",text:JSON.stringify({query,results},null,2)}],structuredContent:{query,results}};
  });

  server.registerTool("get_chess_article",{
    title:"Get a Grandmaster Chess Article",
    description:"Retrieve one published Grandmaster Chess article by URL slug.",
    inputSchema:z.object({slug:z.string().min(1).max(160)}),
    annotations:{readOnlyHint:true,openWorldHint:false}
  },async ({slug})=>{
    const article=(await loadArticles()).find(a=>a.slug===slug);
    if(!article) return {content:[{type:"text",text:"Article not found: "+slug}],isError:true};
    const result={title:article.title,description:article.description,category:article.category,date:article.date,url:article.url,content:article.body};
    return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};
  });

  server.registerTool("find_opening",{
    title:"Find a Chess Opening",
    description:"Return a concise opening reference and related Grandmaster Chess content.",
    inputSchema:z.object({opening:z.string().min(2).max(100)}),
    annotations:{readOnlyHint:true,openWorldHint:false}
  },async ({opening})=>{
    const key=opening.toLowerCase();
    const refs=[
      ["italian game","1.e4 e5 2.Nf3 Nc6 3.Bc4","Open-game opening with an early bishop to c4."],
      ["sicilian defense","1.e4 c5","An asymmetrical response to 1.e4."],
      ["french defense","1.e4 e6","Black prepares a central challenge with ...d5."],
      ["caro-kann","1.e4 c6","Black prepares ...d5 with a solid structure."],
      ["queen's gambit","1.d4 d5 2.c4","White challenges the center with c4."],
      ["king's indian defense","1.d4 Nf6 2.c4 g6","Black prepares a kingside fianchetto."],
      ["english opening","1.c4","White begins with the c-pawn and often targets d5."]
    ];
    const match=refs.find(r=>key.includes(r[0])||r[0].includes(key));
    const related=(await loadArticles()).filter(a=>/opening/i.test(a.title+" "+a.body)).slice(0,5).map(a=>({title:a.title,url:a.url}));
    const result=match?{opening:match[0],moves:match[1],explanation:match[2],related}:{opening,message:"No exact built-in entry. Search the site's articles for this opening.",related};
    return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};
  });

  server.registerTool("get_chess_rules",{
    title:"Get Chess Rules",
    description:"Return a concise standard chess rules reference and a Grandmaster Chess rules link.",
    inputSchema:z.object({topic:z.string().optional().default("all")}),
    annotations:{readOnlyHint:true,openWorldHint:false}
  },async ({topic})=>{
    const rules={
      objective:"Checkmate the opponent king.",
      movement:"Each piece has defined movement rules; a king may not move into check.",
      castling:"Castling requires the relevant king and rook to be unmoved, clear squares, and the king not to be in, through, or into check.",
      en_passant:"A special pawn capture available immediately after an opposing pawn advances two squares and lands beside your pawn.",
      promotion:"A pawn reaching the last rank is promoted to a queen, rook, bishop, or knight.",
      draw:"Draws can arise through stalemate, agreement, repetition, the fifty-move rule, insufficient mating material in applicable rulesets, or other applicable rules."
    };
    const t=topic.toLowerCase();
    const selected=t==="all"?rules:Object.fromEntries(Object.entries(rules).filter(([k])=>k.includes(t)||t.includes(k)));
    const article=(await loadArticles()).find(a=>a.slug.includes("chess-rules-complete"));
    const result={topic,rules:Object.keys(selected).length?selected:rules,source:article?{title:article.title,url:article.url}:{url:SITE_URL+"/learn/chess-rules"}};
    return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};
  });

  server.registerTool("get_chess_puzzle",{
    title:"Get a Chess Puzzle",
    description:"Return a curated practice position in FEN for a selected tactical theme.",
    inputSchema:z.object({theme:z.enum(["fork","pin","mate","skewer","random"]).optional().default("random")}),
    annotations:{readOnlyHint:true,openWorldHint:false}
  },async ({theme})=>{
    const puzzles={
      fork:{fen:"6k1/5ppp/8/8/8/2N5/5PPP/6K1 w - - 0 1",note:"Practice identifying a knight fork."},
      pin:{fen:"4r1k1/5ppp/8/8/8/3B4/5PPP/4R1K1 w - - 0 1",note:"Practice identifying a pinned defender."},
      mate:{fen:"6k1/5ppp/8/8/8/5Q2/5PPP/6K1 w - - 0 1",note:"Practice calculating mating ideas."},
      skewer:{fen:"4k3/8/8/8/8/8/4R3/4K3 w - - 0 1",note:"Practice a line attack."},
      random:{fen:"r1bqk2r/pppp1ppp/2n2n2/8/1b2P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 5",note:"Opening-position calculation exercise."}
    };
    const result={theme,...puzzles[theme]};
    return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};
  });


  server.registerTool("analyze_chess_position",{title:"Analyze Chess Position",description:"Analyze a chess position with Stockfish and return the best move, evaluation, and principal variation.",inputSchema:z.object({fen:z.string().min(10).max(120),difficulty:z.enum(["beginner","intermediate","advanced","master"]).optional().default("intermediate")}),annotations:{readOnlyHint:true,openWorldHint:false}},async({fen,difficulty})=>{try{const result=await analyzePosition(fen,difficulty);return {content:[{type:"text",text:JSON.stringify({fen,...result},null,2)}],structuredContent:{fen,...result}};}catch(e){return {content:[{type:"text",text:e.message}],isError:true};}});
  server.registerTool("coach_chess_move",{title:"Coach My Chess Move",description:"Analyze a played move by comparing the position before and after it with Stockfish. Returns a classification and practical coaching advice.",inputSchema:z.object({beforeFen:z.string().min(10).max(120),afterFen:z.string().min(10).max(120),playedMove:z.string().min(2).max(10),difficulty:z.enum(["beginner","intermediate","advanced","master"]).optional().default("intermediate")}),annotations:{readOnlyHint:true,openWorldHint:false}},async({beforeFen,afterFen,playedMove,difficulty})=>{try{const best=await analyzePosition(beforeFen,difficulty);const after=await analyzePosition(afterFen,difficulty);const result=coachingFromAnalysis({best,after,move:playedMove});return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};}catch(e){return {content:[{type:"text",text:e.message}],isError:true};}});
  server.registerTool("analyze_chess_game",{title:"Analyze Chess Game",description:"Analyze the recorded moves of an active game, identify inaccuracies, mistakes and blunders, and return a concise post-game report.",inputSchema:z.object({gameId:z.string().min(3),difficulty:z.enum(["beginner","intermediate","advanced","master"]).optional().default("intermediate")}),annotations:{readOnlyHint:true,openWorldHint:false}},async({gameId,difficulty})=>{try{const chess=getGame(gameId);if(!chess)throw new Error("Game not found: "+gameId);const moves=recordedMoves(gameId);const issues=[];for(const m of moves){const best=await analyzePosition(m.beforeFen,difficulty);const after=await analyzePosition(m.afterFen,difficulty);const coach=coachingFromAnalysis({best,after,move:m.san});if(coach.classification!=="good"&&coach.classification!=="review")issues.push({ply:m.ply,color:m.color,move:m.san,...coach});}const result={gameId,status:snapshot(gameId,chess).status,totalMoves:moves.length,issues,summary:{blunders:issues.filter(x=>x.classification==="blunder").length,mistakes:issues.filter(x=>x.classification==="mistake").length,inaccuracies:issues.filter(x=>x.classification==="inaccuracy").length},note:"Engine classifications are depth-dependent and intended as training guidance, not a substitute for human coaching."};return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};}catch(e){return {content:[{type:"text",text:e.message}],isError:true};}});

  registerAppTool(server,"start_ai_chess_game",{title:"Start Grandmaster AI Game",description:"Start a new game where the human plays White and Stockfish plays Black.",inputSchema:z.object({difficulty:z.enum(["beginner","intermediate","advanced","master"]).optional().default("intermediate")}),annotations:{readOnlyHint:false,openWorldHint:false},_meta:{ui:{resourceUri:"ui://widget/chess-board.html"},"openai/toolInvocation/invoking":"Starting Grandmaster AI…","openai/toolInvocation/invoked":"Grandmaster AI game ready"}},async({difficulty})=>{const result=createGame("ai");result.difficulty=difficulty;return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};});

  registerAppTool(server,"new_chess_game",{title:"Start a Chess Game",description:"Start a new in-memory standard chess game and return its board state.",inputSchema:z.object({}),annotations:{readOnlyHint:false,openWorldHint:false},_meta:{ui:{resourceUri:"ui://widget/chess-board.html"},"openai/toolInvocation/invoking":"Starting chess…","openai/toolInvocation/invoked":"Chess board ready"}},async()=>{const result=createGame();return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};});
  registerAppTool(server,"play_chess_vs_ai",{title:"Play Against Grandmaster AI",description:"Start or continue a chess game where the human plays White and Stockfish plays Black. The server validates the human move, calculates the engine move, and returns the resulting board.",inputSchema:z.object({gameId:z.string().optional(),from:z.string().regex(/^[a-h][1-8]$/),to:z.string().regex(/^[a-h][1-8]$/),promotion:z.enum(["q","r","b","n"]).optional().default("q"),difficulty:z.enum(["beginner","intermediate","advanced","master"]).optional().default("intermediate")}),annotations:{readOnlyHint:false,openWorldHint:false},_meta:{ui:{resourceUri:"ui://widget/chess-board.html"},"openai/toolInvocation/invoking":"Grandmaster AI is thinking…","openai/toolInvocation/invoked":"Grandmaster AI moved"}} ,async({gameId,from,to,promotion,difficulty})=>{try{let id=gameId;if(!id){const started=createGame("ai");id=started.gameId;}const chess=getGame(id);if(!chess)throw new Error("Game not found: "+id);if(getMode(id).mode!=="ai")throw new Error("This game is not an AI match.");if(chess.isGameOver())throw new Error("Game is over.");if(chess.turn()!=="w")throw new Error("It is not the human player's turn.");const human=playMove(id,from,to,promotion);if(chess.isGameOver())return {content:[{type:"text",text:JSON.stringify(human,null,2)}],structuredContent:human};const engine=await bestMove(chess.fen(),difficulty);if(!engine.bestmove||engine.bestmove.length<4)throw new Error("Engine did not return a legal move.");const ai=playMove(id,engine.bestmove.slice(0,2),engine.bestmove.slice(2,4),engine.bestmove[4]||"q");const result={...ai,gameId:id,humanMove:human.move,aiMove:ai.move,engine:{difficulty,depth:engine.depth,score:engine.score}};return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};}catch(e){return {content:[{type:"text",text:e.message}],isError:true};}});

  server.registerTool("get_chess_game",{title:"Get Chess Game",description:"Get the current state of an in-memory chess game.",inputSchema:z.object({gameId:z.string().min(3)}),annotations:{readOnlyHint:true,openWorldHint:false}},async({gameId})=>{const chess=getGame(gameId);if(!chess)return {content:[{type:"text",text:"Game not found: "+gameId}],isError:true};const result=snapshot(gameId,chess);return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};});
  server.registerTool("get_legal_chess_moves",{title:"Get Legal Chess Moves",description:"Get legal moves from a square in an active game.",inputSchema:z.object({gameId:z.string().min(3),square:z.string().regex(/^[a-h][1-8]$/)}),annotations:{readOnlyHint:true,openWorldHint:false}},async({gameId,square})=>{try{const moves=legalMoves(gameId,square);const result={gameId,square,moves};return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};}catch(e){return {content:[{type:"text",text:e.message}],isError:true};}});
  server.registerTool("make_chess_move",{title:"Make a Chess Move",description:"Make one legal chess move in an active in-memory game. Invalid moves are rejected by chess.js.",inputSchema:z.object({gameId:z.string().min(3),from:z.string().regex(/^[a-h][1-8]$/),to:z.string().regex(/^[a-h][1-8]$/),promotion:z.enum(["q","r","b","n"]).optional().default("q")}),annotations:{readOnlyHint:false,openWorldHint:false}},async({gameId,from,to,promotion})=>{try{const result=playMove(gameId,from,to,promotion);return {content:[{type:"text",text:JSON.stringify(result,null,2)}],structuredContent:result};}catch(e){return {content:[{type:"text",text:e.message}],isError:true};}});

  return server;
}


