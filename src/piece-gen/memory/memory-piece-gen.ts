import { deepCopy } from "deep-copy-ts";
import { injectable } from "tsyringe";
import { Piece, PieceId } from "../../piece/piece";
import { PieceFactory } from "../../piece/piece-factory";
import { RandomGen } from "../../random-gen/random-gen";
import { PieceGenSnapshot, PieceGenType } from "../factory/piece-gen-data";
import { NotInitializedError, PieceGen, PieceList } from "../piece-gen";
import { PieceGenUtil } from "../util/piece-gen-util";

export class InvalidMemorySizeError extends Error {
  constructor() {
    super("Memory size must be smaller than the bag size, otherwise the generator can run out of pieces to spawn!");
  }
}

interface MemoryPieceGenSnapshot extends PieceGenSnapshot {
  bag: PieceId[];
  mem: PieceId[];
  nextMemId: number;
}

@injectable()
export class MemoryPieceGen extends PieceGen {
  private r: RandomGen | undefined;
  private data: MemoryPieceGenSnapshot = {
    type: PieceGenType.MEMORY,
    bag: [],
    mem: [],
    nextMemId: 0,
  };

  constructor(
    private pieceFactory: PieceFactory,
    private util: PieceGenUtil
  ) {
    super();
  }

  snapshot(): MemoryPieceGenSnapshot {
    return deepCopy(this.data);
  }

  restore(snapshot: MemoryPieceGenSnapshot) {
    this.data = snapshot;
    return this;
  }

  init(r: RandomGen, pieceLists: PieceList[], memSize: number) {
    const d = this.data;

    this.r = r;
    d.bag = this.util.getBag(pieceLists);

    // memory size must be smaller than the bag size,
    // otherwise at the end of the first bag, any piece would be a repeat,
    // i.e. there is no legal piece to spawn
    if (memSize >= d.bag.length) {
      throw new InvalidMemorySizeError();
    }

    d.mem = d.bag.splice(d.bag.length - memSize);
  }

  next(): Piece {
    return this.pieceFactory.create(this.nextId());
  }

  nextId(): PieceId {
    if (!this.r) {
      throw new NotInitializedError();
    }

    const d = this.data;

    let i = this.r.int(d.bag.length);
    let ret = d.bag[i];
    d.bag[i] = d.mem[d.nextMemId];
    d.mem[d.nextMemId] = ret;
    d.nextMemId = (d.nextMemId + 1) % d.mem.length;
    return ret;
  }
}
