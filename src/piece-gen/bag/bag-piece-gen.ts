
import { injectable } from "tsyringe";
import { Piece, PieceId } from "../../piece/piece";
import { PieceFactory } from "../../piece/piece-factory";
import { RandomGen } from "../../random-gen/random-gen";
import { NotInitializedError, PieceGen, PieceList } from "../piece-gen";
import { PieceGenUtil } from "../util/piece-gen-util";

@injectable()
export class BagPieceGen implements PieceGen {
  private r: RandomGen | undefined;
  private bag: PieceId[] = [];
  private pieceLists: PieceList[] | undefined;

  constructor(
    private pieceFactory: PieceFactory,
    private util: PieceGenUtil
  ) {}

  init(r: RandomGen, pieceLists: PieceList[]) {
    this.r = r;
    this.pieceLists = pieceLists;
  }

  next(): Piece {
    return this.pieceFactory.create(this.nextId());
  }

  nextId(): PieceId {
    if (!this.pieceLists || !this.r) {
      throw new NotInitializedError();
    }

    if (this.bag.length == 0) {
      this.bag = this.util.getBag(this.pieceLists);
      this.r.shuffle(this.bag);
    }
    
    return this.bag.pop()!;
  }
}