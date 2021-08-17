import "reflect-metadata";
import { mock } from "ts-mockito";
import { container } from "tsyringe";
import { PieceGen } from "../piece-gen/piece-gen";
import { PieceQueue } from "./piece-queue";

describe(PieceQueue.name, () => {
  it("should ", () => {
    const pieceQueue = container.resolve(PieceQueue);

    const pieceGen = mock<PieceGen>();

    pieceQueue.init({
      numHolds: 0,
      numPreviews: 0,
      pieceGen: pieceGen,
    })
  });
});
