import { Category } from "typescript-logging";
import { MemoryPieceGen } from "./piece-gen/memory/memory-piece-gen";

// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
export const logPieceGen = new Category("pieceGen");
export const logMemoryPieceGen = new Category(MemoryPieceGen.name, logPieceGen);
