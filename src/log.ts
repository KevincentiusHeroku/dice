import { Category } from "typescript-logging";
import { MemoryPieceGen } from "./piece-gen/memory/memory-piece-gen";

export const logPieceGen = new Category("pieceGen");
export const logMemoryPieceGen = new Category(MemoryPieceGen.name, logPieceGen);
