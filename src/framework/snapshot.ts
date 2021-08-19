
interface Snapshotable {
  snapshot(): any;
  restore(snapshot: any): Snapshotable;
}
