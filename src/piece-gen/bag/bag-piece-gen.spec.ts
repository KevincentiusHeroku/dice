import "reflect-metadata";
import { BagPieceGen } from "./bag-piece-gen";
import { itShouldPassGenericTests } from "../piece-gen-test-util.spec";
import { container } from "tsyringe";
import { RandomGen } from "../../random-gen/random-gen";
import { PieceList } from "../piece-gen";
import { PieceId } from "../../piece/piece";
import { PieceGenType } from "../factory/piece-gen-data";

describe(BagPieceGen.name, () => {
  const r = new RandomGen(100);
  const pieceLists: PieceList[] = [
    { size: 4, variant: 3, multiplier: 1 },
    { size: 4, variant: 4, multiplier: 1 },
    { size: 4, variant: 5, multiplier: 2 },
  ];

  itShouldPassGenericTests(PieceGenType.BAG, (pieceGen: BagPieceGen, rd, p) => pieceGen.init(rd, p));

  it('should generate one of each piece', () => {
    const pieceGen = container.resolve(BagPieceGen);
    pieceGen.init(r, pieceLists);

    // generate pieces
    const res: PieceId[] = [];
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < pieceLists[i].multiplier; m++) {
        res.push(pieceGen.nextId());
      }
    }

    // verify pieces
    for (let i = 0; i < 3; i++) {
      const pieceList = pieceLists[i];
      const count = res.filter(pid => pid.size == pieceList.size && pid.variant == pieceList.variant).length;
      expect(count).toBe(pieceList.multiplier);
    }
  });
});
