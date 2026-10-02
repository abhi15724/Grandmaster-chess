import { Chess } from "chess.js";
const games=new Map();
const modes=new Map();
export function createGame(mode="human"){const chess=new Chess();const id="gm-"+crypto.randomUUID();games.set(id,chess);modes.set(id,{mode,moves:[]});return snapshot(id,chess);}
export function getGame(id){return games.get(id);}
export function getMode(id){return modes.get(id)||{mode:"human",moves:[]};}
export function snapshot(id,chess){return {gameId:id,fen:chess.fen(),pgn:chess.pgn(),turn:chess.turn(),mode:getMode(id).mode,status:chess.isCheckmate()?"checkmate":chess.isStalemate()?"stalemate":chess.isDraw()?"draw":chess.isCheck()?"check":"playing",isGameOver:chess.isGameOver(),history:chess.history({verbose:true}).map(m=>({san:m.san,from:m.from,to:m.to,piece:m.piece,captured:m.captured||null}))};}
export function playMove(id,from,to,promotion="q"){const chess=games.get(id);if(!chess)throw new Error("Game not found: "+id);const before=chess.fen();const move=chess.move({from,to,promotion});getMode(id).moves.push({ply:chess.history().length,san:move.san,from:move.from,to:move.to,piece:move.piece,beforeFen:before,afterFen:chess.fen(),color:move.color});return {move:{san:move.san,from:move.from,to:move.to},...snapshot(id,chess)};}
export function legalMoves(id,square){const chess=games.get(id);if(!chess)throw new Error("Game not found: "+id);return chess.moves({square,verbose:true}).map(m=>({san:m.san,from:m.from,to:m.to,captured:m.captured||null,promotion:m.promotion||null}));}
export function recordedMoves(id){const m=getMode(id).moves;return m.map(x=>({...x}));}
