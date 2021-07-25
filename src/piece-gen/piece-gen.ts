import { Piece, PieceId } from "../piece/piece";

export interface PieceGen {
  next(): Piece;
  nextId(): PieceId;
}

/**
 * Specifies which pieces are allowed to be spawned. A ruleset has a list of piece criterias.
 */
export interface PieceCriteria {
  size: number;
  variant: number; // if null, then spawn all pieces
  multiplier: number; // if decimal, some pieces will be missing
}
