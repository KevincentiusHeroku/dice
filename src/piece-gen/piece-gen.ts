import { Category } from "typescript-logging";
import { Piece, PieceId } from "../piece/piece";
import { PieceGenSnapshot as PieceGenSnapshot } from "./factory/piece-gen-data";

export const log = new Category("PieceGenerator");

export class NotInitializedError extends Error {
  constructor() {
    super('init must be called before using the piece generator!');
  }
}

export interface PieceList {
  size: number;
  variant?: number; // if undefined, then spawn all pieces of the specified size
  multiplier: number;
}

export interface PieceGen {
  next(): Piece;
  nextId(): PieceId;
  snapshot(): PieceGenSnapshot;
  restore(snapshot: PieceGenSnapshot): PieceGen;
}
