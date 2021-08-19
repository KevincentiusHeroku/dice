import { container } from "tsyringe";
import { PieceUtil } from "../piece/piece-util";
import { RandomGen } from "../random-gen/random-gen";
import { PieceGenType } from "./factory/piece-gen-data";
import { PieceGenFactory } from "./factory/piece-gen-factory";
import { NotInitializedError, PieceGen, PieceList } from "./piece-gen";


export function itShouldPassGenericTests<T extends PieceGen>(
  type: PieceGenType,
  initCallback: (pieceGen: T, r: RandomGen, p: PieceList[]) => void
) {
  const pieceUtil = container.resolve(PieceUtil);
  const pieceGenFactory = container.resolve(PieceGenFactory);
  const r = new RandomGen(100);
  const pieceLists: PieceList[] = [
    { size: 4, variant: 3, multiplier: 1 },
    { size: 4, variant: 4, multiplier: 1 },
    { size: 4, variant: 5, multiplier: 1 },
  ];

  it("should throw error if not initialized", () => {
    const pieceGen: PieceGen = pieceGenFactory.create(type) as T;
    expect(() => pieceGen.nextId() ).toThrow(new NotInitializedError());
  });

  it("should eventually create all the listed pieces", () => {
    const pieceGen = initPieceGen();

    const spawned = new Set<number>();
    for (let i = 0; i < 100; i++) {
      spawned.add(pieceGen.next().id.variant);
    }

    expect(spawned.size).toBe(3);
  });

  it("should reproduce the same sequence when loaded from a snapshot", () => {
    const r1 = new RandomGen(1000);
    const p1 = initPieceGen(r1);
    
    for (let i = 0; i < 100; i++) {
      p1.nextId();
    }
    
    const r2 = new RandomGen(0).restore(r1.snapshot());
    const p2 = initPieceGen(r2);
    p2.restore(p1.snapshot());

    for (let i = 0; i < 100; i++) {
      expect(pieceUtil.equals(p1.nextId(), p2.nextId())).toBeTrue();
    }
  });
    
  function initPieceGen(rd: RandomGen=r) {
    const pieceGen: T = pieceGenFactory.create(type) as T;
    initCallback(pieceGen, rd, pieceLists);
    return pieceGen;
  }
}

