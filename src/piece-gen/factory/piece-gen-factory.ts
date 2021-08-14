import {  container, singleton } from "tsyringe";
import { BagPieceGen } from "../bag/bag-piece-gen";
import { MemoryPieceGen } from "../memory/memory-piece-gen";
import { PieceGen } from "../piece-gen";
import { RandomPieceGen } from "../random/random-piece-gen";
import { PieceGenType } from "./piece-gen-data";

@singleton()
export class PieceGenFactory {
  create(type: PieceGenType): PieceGen {
    switch (type) {
      case PieceGenType.BAG   : return container.resolve(BagPieceGen);
      case PieceGenType.MEMORY: return container.resolve(MemoryPieceGen);
      case PieceGenType.RANDOM: return container.resolve(RandomPieceGen);
    }
  }
}