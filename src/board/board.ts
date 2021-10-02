// import { autoInjectable, injectable } from "tsyringe";
// import { ActivePiece } from "../active-piece/active-piece";
// import { Mat } from "../matrix/mat";
// import { Tile } from "../tile/tile";

// @injectable()
// @autoInjectable()
// export class Board implements Snapshotable {
//   private mat: Mat<Tile>;
//   private activePiece: ActivePiece;

//   constructor(
//     private height: number,
//     private width: number
//   ) {
//     this.mat = new Mat(height, width);
//   }

//   getTile(y: number, x: number) {
//     return this.mat[y][x];
//   }

//   isInside(y: number, x: number) {
//     return y >= 0 && y < this.height && x >= 0 && x < this.width;
//   }

//   checkCollision(dy: number, dx: number, drot: number) {
//     const d = this.data;
//     if (d.piece == null) return false;

//     let tiles = d.piece.tiles;
//     if (drot != 0) {
//       for (let i = 0; i < drot; i++) {
//         tiles.rotate();
//       }
//     }

//     for (let i = 0; i < tiles.length; i++) {
//       for (let j = 0; j < tiles[i].length; j++) {
//         if (tiles[i][j] != null) {
//           const ty = d.y + dy + i;
//           const tx = d.x + dx + j;
//           if (!this.board.isInside(ty, tx) || this.board.getTile(ty, tx) != null) {
//             return true;
//           }
//         }
//       }
//     }
//     return false;
//   }
// }
