import "reflect-metadata";
import { container } from "tsyringe";
import { PieceGenUtil } from "./piece-gen-util";

describe(PieceGenUtil.name, () => {
  const util = container.resolve(PieceGenUtil);

  it("should generate all pieces of the specified size", () => {
    const res = util.getBag([
      { size: 4, multiplier: 1 }
    ]).sort((a,b) => a.variant - b.variant);

    expect(res.length).toBe(7);
    for (let i = 0; i < 7; i++) {
      expect(res[i].size).toBe(4);
      expect(res[i].variant).toBe(i);
    }
  });

  it("should generate three of each piece of the specified size", () => {
    const res = util.getBag([
      { size: 4, multiplier: 3 }
    ]).sort((a,b) => a.variant - b.variant);

    expect(res.length).toBe(21);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 3; j++) {
        expect(res[i*3 + j].size).toBe(4);
        expect(res[i*3 + j].variant).toBe(i);
      }
    }
  });

  it("should generate one of the first piece and three of the second piece", () => {
    const res = util.getBag([
      { size: 4, variant: 2, multiplier: 1 },
      { size: 5, variant: 6, multiplier: 3 },
    ]).sort((a,b) => a.variant - b.variant);

    expect(res.length).toBe(4);

    expect(res[0].size).toBe(4);
    expect(res[0].variant).toBe(2);

    for (let i = 1; i < 4; i++) {
      expect(res[i].size).toBe(5);
      expect(res[i].variant).toBe(6);
    }
  });
});