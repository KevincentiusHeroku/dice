import "reflect-metadata";
import { container } from "tsyringe";
import { RandomPieceGen } from "../piece-gen/random/random-piece-gen";
import { PieceQueue } from "./piece-queue";

describe(PieceQueue.name, () => {
  it("should ", () => {

    const pieceQueue = container.resolve(PieceQueue);

  });
});
