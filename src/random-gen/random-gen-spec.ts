import "reflect-metadata";
import { RandomGen } from "./random-gen";

describe(RandomGen.name, () => {
  const r = new RandomGen(1);

  it("should generate integers", () => {
    for (let i = 0; i < 1000; i++) {
      const res = r.int(100);
      expect(res < 100).toBeTrue();
      expect(res >= 0).toBeTrue();
    }
  });

  it("should return true p% of the times", () => {
    let count = 0;
    for (let i = 0; i < 1000; i++) {
      if (r.chance(0.7)) {
        count++;
      }
    }
    expect(count / 1000 / 0.7 - 1 < 0.1).toBeTrue();
  });
  
  it("should generate numbers between the specified range", () => {
    for (let i = 0; i < 1000; i++) {
      const res = r.range(2, 6);
      expect(res < 6).toBeTrue();
      expect(res >= 2).toBeTrue();
    }
  });
  
  it("should pick random items from the given list", () => {
    let list = ['a', 'b', 'c'].sort();

    let picked = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      picked.add(r.pick(list));
    }
    
    picked.forEach(p => expect(list.indexOf(p) != -1).toBeTrue());
    list.forEach(l => expect(picked.has(l)).toBeTrue());
  });

  it("should shuffle the given array", () => {
    let list = [];
    for (let i = 0; i < 100; i++) {
      list.push(i);
    }

    let shuffled = [...list];
    r.shuffle(shuffled);
    
    let orderIsEqual = true;
    for (let i = 0; i < 100; i++) {
      expect(list.indexOf(shuffled[i]) != -1).toBeTrue();
      orderIsEqual = orderIsEqual && (list[i] == shuffled[i]);
    }
    
    expect(orderIsEqual).toBeFalse();
  });

  it("should produce the same sequence with the same seed", () => {
    let r1 = new RandomGen(10);
    let r2 = new RandomGen(10);
    verifySameSequence(r1, r2);
  });

  it("should produce the same sequence when loaded from a snapshot", () => {
    let r1 = new RandomGen(100);
    for (let i = 0; i < 100; i++) {
      r1.int();
      r1.range(100, 1000);
      r1.chance(0.5);
    }

    let r2 = new RandomGen(0);
    r2.restore(r1.snapshot());

    verifySameSequence(r1, r2);
  });

  function verifySameSequence(r1: RandomGen, r2: RandomGen) {
    for (let i = 0; i < 100; i++) {
      expect(r1.int() == r2.int()).toBeTrue();
      expect(r1.range(100, 1000) == r2.range(100, 1000)).toBeTrue();
      expect(r1.chance(0.5) == r2.chance(0.5)).toBeTrue();
    }
  }
});
