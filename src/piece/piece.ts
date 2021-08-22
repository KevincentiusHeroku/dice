import { Mat } from "../matrix/mat";
import { Tile } from "../tile/tile";

export interface PieceId {
  size: number;
  variant: number;
}

interface PieceData {
  id: PieceId;
  tiles: any;
}

export class Piece implements Snapshotable {
  constructor(
    public id: PieceId,
    public tiles: Mat<Tile>
  ) {}

  snapshot(): PieceData {
    return {
      id: this.id,
      tiles: this.tiles.snapshot()
    };
  }

  restore(snapshot: PieceData): Snapshotable {
    this.id = snapshot.id;
    this.tiles = new Mat<Tile>(1, 1);
    this.tiles.copy(snapshot.tiles);
    return this;
  }
  
}
