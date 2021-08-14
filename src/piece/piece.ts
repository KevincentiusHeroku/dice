import { singleton } from "tsyringe";
import { Tile } from "../tile/tile";

export interface Piece {
  id: PieceId;
  tiles: Tile[][];
}

export interface PieceId {
  size: number;
  variant: number;
}
