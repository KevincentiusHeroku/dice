import * as seedrandom from "seedrandom";

/** This is an interface from seedrandom - the library just doesn't expose the interface. */
interface Prng {
  (): number;
  double(): number;
  int32(): number;
  quick(): number;
  state(): seedrandom.State;
}

interface RandomGenSnapshot {
  state: object;
}

export class RandomGen {
  private r: Prng;
  constructor(seed: number) {
    this.r = seedrandom.alea(seed.toString(), { state: true });
  }

  snapshot(): RandomGenSnapshot {
    return { state: this.r.state() };
  }

  restore(snapshot: RandomGenSnapshot) {
    this.r = seedrandom.alea(undefined, { state: snapshot.state });
    return this;
  }

  int(max: number = Number.MAX_SAFE_INTEGER) {
    return Math.abs(this.r.int32()) % max;
  }

  chance(chance: number) {
    return this.r.double() < chance;
  }

  range(min: number, max: number) {
    return this.r.double() * (max - min) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(arr.length)];
  }

  shuffle(array: any[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = this.int(currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
