import { Mat } from "./mat";

describe(Mat.name, () => {
  it("should be a matrix of size i x j", () => {
    const mat = new Mat(3, 5);
    expect(mat.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect(mat[i].length).toBe(5);
    }
  });

  it("should not support rotation on non-square matrices", () => {
    const mat = new Mat(3, 5);
    expect(() => mat.rotate()).toThrow();
  });

  it("should not support zero sized matrix", () => {
    expect(() => new Mat(0, 5)).toThrow();
  });

  it("should rotate the matrix clockwise", () => {
    const before = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const after = [
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3]
    ];

    const mat = new Mat<number>(3, 3);
    mat.copy(before);
    mat.rotate();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expect(mat[i][j]).toBe(after[i][j]);
      }
    }

    // should return to initial state after four rotations
    mat.rotate();
    mat.rotate();
    mat.rotate();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expect(mat[i][j]).toBe(before[i][j]);
      }
    }
  });

  it("should return the length of the matrix if empty", () => {
    const mat = new Mat<number>(4, 4);
    expect(mat.getNumEmptyRowsBottom()).toBe(4);
  });

  it("should return the number of completely empty rows on the bottom of the matrix", () => {
    const mat = new Mat<number>(4, 4);
    mat[0][2] = 4;
    expect(mat.getNumEmptyRowsBottom()).toBe(3);

    mat[1][1] = 4;
    expect(mat.getNumEmptyRowsBottom()).toBe(2);

    mat[2][0] = 4;
    expect(mat.getNumEmptyRowsBottom()).toBe(1);

    mat[0][2] = null;
    mat[1][1] = null;
    expect(mat.getNumEmptyRowsBottom()).toBe(1);
    
    mat[3][0] = 4;
    expect(mat.getNumEmptyRowsBottom()).toBe(0);
  });

  it("should return the number of completely empty rows on the top of the matrix", () => {
    const mat = new Mat<number>(4, 4);
    mat[3][2] = 4;
    expect(mat.getNumEmptyRowsTop()).toBe(3);

    mat[2][1] = 4;
    expect(mat.getNumEmptyRowsTop()).toBe(2);

    mat[1][0] = 4;
    expect(mat.getNumEmptyRowsTop()).toBe(1);

    mat[3][2] = null;
    mat[2][1] = null;
    expect(mat.getNumEmptyRowsTop()).toBe(1);
    
    mat[0][0] = 4;
    expect(mat.getNumEmptyRowsTop()).toBe(0);
  });
});
