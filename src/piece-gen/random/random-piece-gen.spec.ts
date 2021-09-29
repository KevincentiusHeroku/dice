import "reflect-metadata";
import { itShouldPassGeneralPieceGenTests } from "../piece-gen-test-util.spec";
import { RandomPieceGen } from "./random-piece-gen";

describe(RandomPieceGen.name, () => {
  itShouldPassGeneralPieceGenTests(RandomPieceGen.TYPE, (pieceGen: RandomPieceGen, r, p) => pieceGen.init(r, p));
});
