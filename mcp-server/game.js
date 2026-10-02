import { Chess } from "chess.js";
const games=new Map();
export function createGame(){const chess=new Chess();const id="gm-"+crypto.randomUUID();games.set(id,chess);return snapshot(id,chess);}
export function getGame(id){return games.get(id);}
export function snapshot(id,chess){return {gameId:id,fen:chess.fen(),pgn:chess.pgn(),turn:chess.turn(),status:chess.isCheckmate()?"checkmate":chess.isStalemate()?"stalemate":chess.isDraw()?"draw":chess.isCheck()?"check":"playing",isGameOver:chess.isGameOver(),history:chess.history({verbose:true}).map(m=>({san:m.san,from:m.from,to:m.to,piece:m.piece,captured:m.captured||null}))};}
export function playMove(id,from,to,promotion="q"){const chess=games.get(id);if(!chess)throw new Error("Game not found: "+id);const move=chess.move({from,to,promotion});return {move:{san:move.san,from:move.from,to:move.to},...snapshot(id,chess)};}
export function legalMoves(id,square){const chess=games.get(id);if(!chess)throw new Error("Game not found: "+id);return chess.moves({square,verbose:true}).map(m=>({san:m.san,from:m.from,to:m.to,captured:m.captured||null,promotion:m.promotion||null}));}
