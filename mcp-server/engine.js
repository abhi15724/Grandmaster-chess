import { Stockfish } from "@se-oss/stockfish";
let enginePromise;
async function engine(){
  if(!enginePromise){enginePromise=(async()=>{const e=new Stockfish();await e.waitReady();return e;})();} 
  return enginePromise;
}
const depths={beginner:8,intermediate:12,advanced:16,master:20};
export async function bestMove(fen,difficulty="intermediate"){
  const e=await engine();
  const depth=depths[difficulty]||depths.intermediate;
  const result=await e.analyze(fen,depth);
  return {bestmove:result.bestmove,score:result.lines?.[0]?.score||null,depth};
}
