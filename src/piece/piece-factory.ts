import { singleton } from "tsyringe";
import { Mat } from "../matrix/mat";
import { Tile } from "../tile/tile";
import { Piece, PieceId } from "./piece";
import { PIECES } from "./piece-data";

@singleton()
export class PieceFactory {
  create(pieceId: PieceId): Piece {
    let size = pieceId.size;
    let variant = pieceId.variant;

    let p = PIECES[size - 1][variant];
  
    let mat: Tile[][] = new Array();
    for (let i = 0; i < p.matSize; i++) {
        mat.push(new Array(p.matSize));
    }
  
    for (let t of p.sparse) {
        mat[t[0]][t[1]] = {
            colorId: p.color != null ? p.color : (variant % 7),
            isGarbage: false,
        };
    }
  
    const tiles = new Mat<Tile>(1, 1);
    tiles.copy(mat);
    
    return new Piece({size, variant}, tiles);
  }
}
