import { singleton } from "tsyringe";
import { Piece, PieceId } from "./piece";

@singleton()
export class PieceUtil {
  equals(pieceId1: PieceId, pieceId2: PieceId): boolean {
    return pieceId1.size == pieceId2.size && pieceId1.variant == pieceId2.variant;
  }

  equalsPiece(piece1: Piece | null, piece2: Piece | null): boolean {
    if (piece1 == piece2) {
      return true;
    }

    return piece1 == piece2 
      || (piece1 != null && piece2 != null && this.equals(piece1.id, piece2.id));
  }
}
