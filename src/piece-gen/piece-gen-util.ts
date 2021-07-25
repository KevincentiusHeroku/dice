import { PIECES } from "../piece/piece-data";

export class RandomUtil {
  getBag(list: any[]) {
    let bag: number[][] = [];
    // refill bag
    for (let e of list) {
        for (let m = 0; m < e.multiplier; m++) {
            if (e.pieceId == null) {
                for (let i = 0; i < PIECES[e.size - 1].length; i++) {
                    bag.push([e.size, i]);
                }
            } else {
                bag.push([e.size, e.pieceId]);
            }
        }
    }
    return bag;
  }
}
