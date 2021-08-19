import "reflect-metadata";
import { instance, mock, verify, when } from "ts-mockito";
import { container } from "tsyringe";
import { PieceGen } from "../piece-gen/piece-gen";
import { Piece } from "../piece/piece";
import { PieceUtil } from "../piece/piece-util";
import { PieceQueue } from "./piece-queue";

describe(PieceQueue.name, () => {
  const pieceUtil = container.resolve(PieceUtil);
  
  it("should fill its queue on initialization", () => {
    const { iPieceGen } = mockPieceGen(5);

    // test execution
    const pieceQueue = container.resolve(PieceQueue);
    pieceQueue.init({
      numHolds: 0,
      numPreviews: 5,
      pieceGen: instance(iPieceGen),
    });

    // verification
    verify(iPieceGen.next()).times(5);
    expect().nothing();
  });

  it("should be FIFO", () => {
    const { iPieceGen, pieces } = mockPieceGen(15);

    // test execution
    const pieceQueue = container.resolve(PieceQueue);
    pieceQueue.init({
      numHolds: 0,
      numPreviews: 5,
      pieceGen: instance(iPieceGen),
    });

    for (let i = 0; i < 5; i++) {
      expect(pieceQueue.next() === pieces[i]).toBeTrue();
    }

    // verification
    verify(iPieceGen.next()).times(10);

    // test execution 2: snapshot
    const restored = container.resolve(PieceQueue);
    restored.restore(pieceQueue.snapshot());

    expect().nothing();
  });

  it("should swap the hold piece with the corresponding slot", () => {
    const { iPieceGen, pieces } = mockPieceGen(10);

    // test execution
    const pieceQueue = container.resolve(PieceQueue);
    pieceQueue.init({
      numHolds: 3,
      numPreviews: 5,
      pieceGen: instance(iPieceGen),
    });

    // test execution
    expect(pieceQueue.hold(2, pieces[5])).toBeNull();
    expect(pieceQueue.hold(2, pieces[6]) === pieces[5]).toBeTrue();
    expect(pieceQueue.hold(1, pieces[7])).toBeNull();
    expect(pieceQueue.hold(2, pieces[8]) == pieces[6]).toBeTrue();
    expect(pieceQueue.hold(1, null) === pieces[7]).toBeTrue();
    expect(pieceQueue.hold(1, null)).toBeNull();
  });
  
  it("should work after being restored from a snapshot", () => {
    const { iPieceGen, pieces } = mockPieceGen(10);

    // test execution
    const pieceQueue = container.resolve(PieceQueue);
    pieceQueue.init({
      numHolds: 3,
      numPreviews: 5,
      pieceGen: instance(iPieceGen),
    });

    // test execution
    expect(pieceQueue.hold(2, pieces[5])).toBeNull();
    expect(pieceQueue.hold(2, pieces[6]) === pieces[5]).toBeTrue();

    const pieceQueue2 = container.resolve(PieceQueue);
    pieceQueue2.init({
      numHolds: 3,
      numPreviews: 5,
      pieceGen: instance(iPieceGen),
    });
    pieceQueue2.restore(pieceQueue.snapshot());
    expect(pieceQueue2.hold(1, pieces[7])).toBeNull();
    expect(pieceUtil.equalsPiece(pieceQueue2.hold(2, pieces[8]), pieces[6])).toBeTrue();
    expect(pieceUtil.equalsPiece(pieceQueue2.hold(1, null), pieces[7])).toBeTrue();
    expect(pieceQueue2.hold(1, null)).toBeNull();
  });
  
  function mockPieceGen(numPieces: number): { iPieceGen: PieceGen, pieces: Piece[] } {
    // mock pieces
    const pieces : Piece[] = [];
    for (let i = 0; i < numPieces; i++) {
      pieces.push({ id: { size: 5, variant: i }, tiles: [] });
    }
    expect(pieces[0] == pieces[1]).toBeFalse();

    // mock pieceGen
    const iPieceGen = mock<PieceGen>();
    const w = when(iPieceGen.next());
    for (let i = 0; i < numPieces; i++) {
      w.thenReturn(pieces[i]);
    }
    
    return { iPieceGen: iPieceGen, pieces: pieces };
  }
});
