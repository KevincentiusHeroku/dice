import "reflect-metadata";
import { container } from "tsyringe";
import { RandomGen } from "../../random-gen/random-gen";
import { InvalidMemorySizeError, MemoryPieceGen } from "./memory-piece-gen";
import { PieceList } from "../piece-gen";
import { itShouldPassGeneralPieceGenTests } from "../piece-gen-test-util.spec";
import { PieceGenType } from "../factory/piece-gen-data";

describe(MemoryPieceGen.name, () => {
  const r = new RandomGen(100);
  const pieceLists: PieceList[] = [
    { size: 4, variant: 3, multiplier: 1 },
    { size: 4, variant: 4, multiplier: 1 },
    { size: 4, variant: 5, multiplier: 1 },
  ];

  itShouldPassGeneralPieceGenTests(PieceGenType.MEMORY, (pieceGen: MemoryPieceGen, r2, p) => pieceGen.init(r2, p, 2));

  it("should throw error if bag size >= memory size", () => {
    const pieceGen = container.resolve(MemoryPieceGen);
    expect(() => pieceGen.init(r, pieceLists, 3) ).toThrow(new InvalidMemorySizeError());
  });
});
