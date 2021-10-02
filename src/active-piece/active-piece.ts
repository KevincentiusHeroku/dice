import { deepCopy } from "deep-copy-ts";
import { Piece } from "../piece/piece";

interface ActivePieceData {
  piece: Piece | null;
  x: number;
  y: number;
  rot: number;
  isLastMoveRotation: boolean;
}

export class ActivePiece implements Snapshotable {
  private data: ActivePieceData = {
    piece: null,
    x: 0,
    y: 0,
    rot: 0,
    isLastMoveRotation: false
  };

  snapshot() {
    return deepCopy(this.data);
  }

  restore(snapshot: any): Snapshotable {
    this.data = snapshot;
    return this;
  }
}
