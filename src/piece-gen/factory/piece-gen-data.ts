
export enum PieceGenType {
  RANDOM = "RANDOM",
  MEMORY = "MEMORY",
  BAG = "BAG",
}

export interface PieceGenSnapshot {
  type: PieceGenType;
}
