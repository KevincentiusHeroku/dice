import { injectable } from "tsyringe";
import { PieceGen } from "../piece-gen/piece-gen";
import { Piece } from "../piece/piece";

interface PieceQueueSnapshot {
  previews: Piece[];
  holds: Piece[];
  holdUsed: boolean;
}

@injectable()
export class PieceQueue {
  private pieceGen: PieceGen | undefined;

  private data: PieceQueueSnapshot = {
    previews: [],
    holds: [],
    holdUsed: false,
  }

  init(opts: {
    numPreviews: number,
    numHolds: number,
    pieceGen: PieceGen,
  }) {
    const d = this.data;

    d.previews = new Array(opts.numPreviews);
    d.holds = new Array(opts.numHolds);
    this.pieceGen = opts.pieceGen;

    for (let i = 0; i < d.previews.length; i++) {
      d.previews[i] = this.pieceGen.next();
    }
  }

  next(): Piece {
    const d = this.data;

    // keep first piece to return later
    const ret = d.previews[0];

    // shift piece slots
    for (let i = 0; i < d.previews.length - 1; i++) {
      d.previews[i] = d.previews[i + 1];
    }

    // refill last slot
    d.previews[d.previews.length - 1] = this.pieceGen!.next();

    return ret;
  }

  hold(slot: number, piece: Piece): Piece | null {
    const d = this.data;
    const ret = d.holds[slot];
    d.holds[slot] = piece;
    if (ret == null) {
      this.next();
    }
    return ret;
  }
}
