
interface Snapshotable<T> {
  snapshot(): T;
  restore(snapshot: any): Snapshotable<T>;
}

class Snapshot<T> {
  constructor(
    private data: T
  ) {}
}