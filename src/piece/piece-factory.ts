import { singleton } from "tsyringe";
import { Tile } from "../tile/tile";
import { Piece } from "./piece";
import { PIECES } from "./piece-data";

@singleton()
export class PieceFactory {
  create(size: number, variant: number): Piece {
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
  
    return {
        tiles: mat,
        id: {
          size,
          variant: variant
        }
    };
  }
}
