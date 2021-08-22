
import { deepCopy } from "deep-copy-ts";
import { injectable } from "tsyringe";
import { Piece, PieceId } from "../../piece/piece";
import { PieceFactory } from "../../piece/piece-factory";
import { RandomGen } from "../../random-gen/random-gen";
import { PieceGenSnapshot, PieceGenType } from "../factory/piece-gen-data";
import { NotInitializedError, PieceGen, PieceList } from "../piece-gen";
import { PieceGenUtil } from "../util/piece-gen-util";

interface BagPieceGenSnapshot extends PieceGenSnapshot {
  bag: PieceId[];
  pieceLists: PieceList[] | undefined;
}

@injectable()
export class BagPieceGen extends PieceGen {
  private r: RandomGen | undefined;
  private data: BagPieceGenSnapshot = {
    type: PieceGenType.BAG,
    bag: [],
    pieceLists: undefined,
  };

  constructor(
    private pieceFactory: PieceFactory,
    private util: PieceGenUtil
  ) {
    super();
  }

  snapshot(): BagPieceGenSnapshot {
    return deepCopy(this.data);
  }

  restore(snapshot: BagPieceGenSnapshot): BagPieceGen {
    this.data = snapshot;
    return this;
  }

  init(r: RandomGen, pieceLists: PieceList[]) {
    this.r = r;
    this.data.pieceLists = pieceLists;
  }

  next(): Piece {
    return this.pieceFactory.create(this.nextId());
  }

  nextId(): PieceId {
    const d = this.data;

    if (!d.pieceLists || !this.r) {
      throw new NotInitializedError();
    }

    if (d.bag.length == 0) {
      d.bag = this.util.getBag(d.pieceLists);
      this.r.shuffle(d.bag);
    }
    
    return d.bag.pop()!;
  }
}