
export class Mat<T> extends Array<Array<T | null>> {
  constructor(height: number, width: number) {
    if (height == 0) {
      throw new Error('The matrix height cannot be 0!');
    }
    super(height);

    for (let i = 0; i < this.length; i++) {
      this[i] = new Array(width);
    }
  }

  rotate() {
    if (this.length > 0 && this.length != this[0].length) {
      throw new Error('Rotation is currently only implemented for square matrices (basically for active piece).');
    }

    const l = this.length;
    const h = Math.floor(this.length / 2);

    // rotate corners
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < h; j++) {
        const tmp = this[i][j];
        this[i][j] = this[l-j-1][i];
        this[l-j-1][i] = this[l-i-1][l-j-1];
        this[l-i-1][l-j-1] = this[j][l-i-1];
        this[j][l-i-1] = tmp;
      }
    }

    // rotate edges
    for (let i = 0; i < h; i++) {
      const tmp = this[i][h];
      this[i][h] = this[h][i];
      this[h][i] = this[l-i-1][h];
      this[l-i-1][h] = this[h][l-i-1];
      this[h][l-i-1] = tmp;
    }
  }

  getNumEmptyRowsBottom() {
    for (let n = 0; n < this.length; n++) {
      let i = this.length - 1 - n;
      for (const cell of this[i]) {
        if (cell != null) {
          return n;
        }
      }
    }
    return this.length;
  }

  getNumEmptyRowsTop() {
    for (let i = 0; i < this.length; i++) {
      for (const cell of this[i]) {
        if (cell != null) {
          return i;
        }
      }
    }
  }

  copy(other: T[][]) {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        this[i][j] = other[i][j];
      }
    }
  }
}
