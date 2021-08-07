import { injectable } from "tsyringe";
import { logMemoryPieceGen } from "../../log";
import { Piece, PieceId } from "../../piece/piece";
import { PieceFactory } from "../../piece/piece-factory";
import { RandomGen } from "../../random-gen/random-gen";
import { NotInitializedError, PieceGen, PieceList } from "../piece-gen";
import { PieceGenUtil } from "../util/piece-gen-util";

export class InvalidMemorySizeError extends Error {
  constructor() {
    super("Memory size must be smaller than the bag size, otherwise the generator can run out of pieces to spawn!");
  }
}

@injectable()
export class MemoryPieceGen implements PieceGen {
  private r: RandomGen | undefined;
  private bag: PieceId[] = [];
  private mem: PieceId[] = [];
  private nextMemId = 0;

  private log = logMemoryPieceGen;

  constructor(
    private pieceFactory: PieceFactory,
    private util: PieceGenUtil
  ) {}

  init(r: RandomGen, pieceLists: PieceList[], memSize: number) {
    this.r = r;
    this.bag = this.util.getBag(pieceLists);

    // memory size must be smaller than the bag size,
    // otherwise at the end of the first bag, any piece would be a repeat,
    // i.e. there is no legal piece to spawn
    if (memSize >= this.bag.length) {
      throw new InvalidMemorySizeError();
    }

    this.mem = this.bag.splice(this.bag.length - memSize);
  }

  next(): Piece {
    return this.pieceFactory.create(this.nextId());
  }

  nextId(): PieceId {
    if (!this.r) {
      throw new NotInitializedError();
    }

    let r = this.r.int(this.bag.length);
    let ret = this.bag[r];
    this.bag[r] = this.mem[this.nextMemId];
    this.mem[this.nextMemId] = ret;
    this.nextMemId = (this.nextMemId + 1) % this.mem.length;
    return ret;
  }
}
