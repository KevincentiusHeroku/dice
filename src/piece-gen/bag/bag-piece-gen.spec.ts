import "reflect-metadata";
import { BagPieceGen } from "./bag-piece-gen";
import { itShouldPassGenericTests } from "../piece-gen-test-util.spec";

describe(BagPieceGen.name, () => {
  itShouldPassGenericTests(BagPieceGen, (pieceGen: BagPieceGen, r, p) => pieceGen.init(r, p));
});
