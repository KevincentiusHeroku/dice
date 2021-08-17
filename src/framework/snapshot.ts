
interface Snapshotable<T> {
  snapshot(): T;
  restore(snapshot: any): Snapshotable<T>;
}