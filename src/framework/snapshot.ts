
interface Snapshotable {
  snapshot(): any;
  restore(snapshot: any): Snapshotable;
}

class Snapshot<T> {
  constructor(
    private data: T
  ) {}
}