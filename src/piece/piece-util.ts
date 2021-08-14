import { singleton } from "tsyringe";
import { PieceId } from "./piece";

@singleton()
export class PieceUtil {
  equals(pieceId1: PieceId, pieceId2: PieceId): boolean {
    return pieceId1.size == pieceId2.size && pieceId1.variant == pieceId2.variant;
  }
}
