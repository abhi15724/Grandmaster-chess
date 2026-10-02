import { Stockfish } from "@se-oss/stockfish";
let enginePromise;
async function engine(){
  if(!enginePromise){enginePromise=(async()=>{const e=new Stockfish();await e.waitReady();return e;})();} 
  return enginePromise;
}
const depths={beginner:8,intermediate:12,advanced:16,master:20};
function cpScore(score){return score?.type==="cp"?Number(score.value):null;}
function formatScore(score){
  const cp=cpScore(score);
  if(cp!==null)return {type:"cp",value:cp,pawns:Number((cp/100).toFixed(2))};
  return score||null;
}
export async function analyzePosition(fen,difficulty="intermediate"){
  const e=await engine();
  const depth=depths[difficulty]||depths.intermediate;
  const result=await e.analyze(fen,depth);
  const line=result.lines?.[0];
  return {bestmove:result.bestmove||null,score:formatScore(line?.score||null),pv:line?.pv||[],depth};
}
export async function bestMove(fen,difficulty="intermediate"){
  return analyzePosition(fen,difficulty);
}
export function classifyLoss(loss){
  if(loss>=300)return "blunder";
  if(loss>=150)return "mistake";
  if(loss>=70)return "inaccuracy";
  return "good";
}
export function coachingFromAnalysis({best,after,move}){
  const beforeCp=best.score?.type==="cp"?best.score.value:null;
  const afterCp=after.score?.type==="cp"?after.score.value:null;
  if(beforeCp===null||afterCp===null)return {classification:"review",message:"The engine returned a mate-based evaluation, so this move needs a tactical review rather than a centipawn loss label.",bestMove:best.bestmove};
  const playerAfter=-afterCp;
  const loss=Math.max(0,beforeCp-playerAfter);
  const classification=classifyLoss(loss);
  const message=classification==="blunder"
    ? "This move loses a large amount of evaluation. Look for forcing moves first: checks, captures, and threats."
    : classification==="mistake"
    ? "This move gives up a significant part of the position. Compare it with the engine's best move and check the opponent's reply."
    : classification==="inaccuracy"
    ? "This move is playable but gives away some advantage. Check whether a more forcing continuation was available."
    : "This move is close to the engine's preferred continuation at the selected depth.";
  return {classification,lossCp:loss,lossPawns:Number((loss/100).toFixed(2)),bestMove:best.bestmove,principalVariation:after.pv.slice(0,8),message,playedMove:move};
}
