import { injectable } from "tsyringe";
import { Piece, PieceId } from "../../piece/piece";
import { PieceFactory } from "../../piece/piece-factory";
import { RandomGen } from "../../random-gen/random-gen";
import { PieceGenSnapshot, PieceGenType } from "../factory/piece-gen-data";
import { NotInitializedError, PieceGen, PieceList } from "../piece-gen";
import { PieceGenUtil } from "../util/piece-gen-util";

interface RandomPieceGenSnapshot extends PieceGenSnapshot {}

@injectable()
export class RandomPieceGen implements PieceGen<RandomPieceGenSnapshot> {
  public static TYPE = PieceGenType.RANDOM;
  private r: RandomGen | undefined;
  private bag: PieceId[] = [];

  constructor(
    private pieceFactory: PieceFactory,
    private util: PieceGenUtil
  ) {}
  
  snapshot(): RandomPieceGenSnapshot {
    return {
      type: PieceGenType.RANDOM
    };
  }

  restore(snapshot: PieceGenSnapshot) { return this; }

  init(r: RandomGen, pieceLists: PieceList[]) {
    this.r = r;
    this.bag = this.util.getBag(pieceLists);
  }

  next(): Piece {
    return this.pieceFactory.create(this.nextId());
  }

  nextId(): PieceId {
    if (!this.r) {
      throw new NotInitializedError();
    }
    return this.r.pick(this.bag);
  }
}
