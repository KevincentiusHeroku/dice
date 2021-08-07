import { singleton } from "tsyringe";
import { PieceId } from "../../piece/piece";
import { PIECES } from "../../piece/piece-data";
import { PieceList } from "../piece-gen";

@singleton()
export class PieceGenUtil {
  getBag(pieceLists: PieceList[]): PieceId[] {
    let bag: PieceId[] = [];
    // refill bag
    for (let pieceList of pieceLists) {
      for (let m = 0; m < pieceList.multiplier; m++) {
        if (pieceList.variant == null) {
          for (let i = 0; i < PIECES[pieceList.size - 1].length; i++) {
            bag.push({ size: pieceList.size, variant: i });
          }
        } else {
          bag.push({ size: pieceList.size, variant: pieceList.variant });
        }
      }
    }
    return bag;
  }
}
