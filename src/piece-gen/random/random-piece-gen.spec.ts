import "reflect-metadata";
import { itShouldPassGenericTests } from "../piece-gen-test-util.spec";
import { RandomPieceGen } from "./random-piece-gen";

describe(RandomPieceGen.name, () => {
  itShouldPassGenericTests(RandomPieceGen, (pieceGen: RandomPieceGen, r, p) => pieceGen.init(r, p));
});
