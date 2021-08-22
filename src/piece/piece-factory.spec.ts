import "reflect-metadata";
import { container } from "tsyringe";
import { PIECES } from "./piece-data";
import { PieceFactory } from "./piece-factory";

describe(PieceFactory.name, () => {
  const pieceFactory = container.resolve(PieceFactory);

  it("should create the T-piece", () => {
    const piece = pieceFactory.create({ size: 4, variant: 5});
    expect(piece.id.size).toBe(4);
    expect(piece.id.variant).toBe(5);
    expect(piece.tiles.length).toBe(3);
    expect(piece.tiles[0].length).toBe(3);
    expect(piece.tiles[0][0]).toBeFalsy();
    expect(piece.tiles[0][1]).toBeTruthy();
    expect(piece.tiles[0][2]).toBeFalsy();
    expect(piece.tiles[1][0]).toBeTruthy();
    expect(piece.tiles[1][1]).toBeTruthy();
    expect(piece.tiles[1][2]).toBeTruthy();
    expect(piece.tiles[2][0]).toBeFalsy();
    expect(piece.tiles[2][1]).toBeFalsy();
    expect(piece.tiles[2][2]).toBeFalsy();
  });

  it("should only create connected pieces", () => {
    for (let size = 2; size <= 6; size++) {
      for (let variant = 0; variant < PIECES[size-1].length; variant++) {
        const piece = pieceFactory.create({ size, variant });
        expect(piece.id.size).toBe(size);
        
        for (let p of PIECES[size-1][variant].sparse) {
          expect(isMinoConnected(p[0], p[1], piece.tiles)).toBeTrue();
        }
      }
    }
  });

  it("should contain the right number of minoes", () => {
    for (let size = 1; size <= 6; size++) {
      for (let variant = 0; variant < PIECES[size-1].length; variant++) {
        const piece = pieceFactory.create({ size, variant });
        expect(piece.id.size).toBe(size);
        expect(piece.tiles.map(row => row.filter(t => t != null).length).reduce((a, b) => a + b)).toBe(size);
      }
    }
  });
});

function isMinoConnected(y: number, x: number, mat: any[][]) {
  for (let d of [[-1,0], [1,0], [0,-1], [0,1]]) {
    const ti = y + d[0];
    const tj = x + d[1];
    if (isInside(ti, tj, mat) && mat[ti][tj] != null) {
      return true;
    }
  }
  return false;
}

function isInside(y: number, x: number, mat: any[][]) {
  return y >= 0 && y < mat[0].length && x >= 0 && x < mat.length;
}