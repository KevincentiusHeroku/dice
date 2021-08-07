import { container } from "tsyringe";
import { RandomGen } from "../random-gen/random-gen";
import { NotInitializedError, PieceGen, PieceList } from "./piece-gen";

export function itShouldPassGenericTests<T extends PieceGen>(
  classRef: any,
  initCallback: (pieceGen: T, r: RandomGen, p: PieceList[]) => void
) {
  const r = new RandomGen(100);
  const pieceLists: PieceList[] = [
    { size: 4, variant: 3, multiplier: 1 },
    { size: 4, variant: 4, multiplier: 1 },
    { size: 4, variant: 5, multiplier: 1 },
  ];

  it("should throw error if not initialized", () => {
    const pieceGen: PieceGen = container.resolve(classRef);
    expect(() => pieceGen.nextId() ).toThrow(new NotInitializedError());
  });

  it("should eventually create all the listed pieces", () => {
    const pieceGen: T = container.resolve(classRef);
    initCallback(pieceGen, r, pieceLists);

    const spawned = new Set<number>();
    for (let i = 0; i < 100; i++) {
      spawned.add(pieceGen.next().id.variant);
    }

    expect(spawned.size).toBe(3);
  });
}
