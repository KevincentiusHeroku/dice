import { persistent, provides, requires } from "../annotations/field-annotation";
import { dice } from "../annotations/scope-annotation";
import { ContainerImpl, createContainer } from "../container/container";
import { Serializer } from "./serializer";

@dice()
class SnapshotTestChild1 {
  public val = 0;
  @persistent() public pval = 0;
  snapshot() { return this.val * 100; }
  restore(val: number) { this.val = val / 100; }
}

@dice()
class SnapshotTestChild2 {
  public val = 0;
  @persistent() public pval = 0;
  @requires(SnapshotTestChild1) child1!: SnapshotTestChild1;
  snapshot() { return this.val * 1000; }
  restore(val: number) { this.val = val / 1000; }
}

@dice()
class SnapshotTestParent {
  @provides(SnapshotTestChild1) child1!: SnapshotTestChild1;
  @provides(SnapshotTestChild2) child2!: SnapshotTestChild2;
  
  public val = 0;
  @persistent() public pval = 0;
  snapshot() { return this.val * 10; }
  restore(val: number) { this.val = val / 10; }
}

@dice()
class SnapshotTestConflict {
  @persistent() public pval = 'foo';
  snapshot() { return { pval: 'bar' }}
  restore(memento: any) {}
}

@dice()
class SnapshotTestObject {
  @persistent() public pval = 'foo';
  public oval = 'bar';
  snapshot() { return { oval: this.oval }; }
  restore(memento: any) { this.oval = memento.oval; }
}

describe(Serializer + ' (snapshot/restore)', () => {
  const container = createContainer();
  const serializer: Serializer = container.resolve(Serializer);

  it('should persist both @persistent fields and snapshot()', () => {
    const parent: SnapshotTestParent = container.resolve(SnapshotTestParent);
    
    parent.val = 1;
    parent.pval = 2;
    parent.child1.val = 3;
    parent.child1.pval = 4;
    parent.child2.val = 5;
    parent.child2.pval = 6;

    const memento = serializer.serialize(parent);
    expect(memento.snapshot).toBe(10);
    expect(memento.pval).toBe(2);
    expect(memento.child1.snapshot).toBe(300);
    expect(memento.child1.pval).toBe(4);
    expect(memento.child2.snapshot).toBe(5000);
    expect(memento.child2.pval).toBe(6);

    const restored: SnapshotTestParent = serializer.restore(SnapshotTestParent, memento);
    expect(restored.val).toBe(1);
    expect(restored.pval).toBe(2);
    expect(restored.child1.val).toBe(3);
    expect(restored.child1.pval).toBe(4);
    expect(restored.child2.val).toBe(5);
    expect(restored.child2.pval).toBe(6);
    expect(restored.child2.child1).toBe(restored.child1);
  });

  it('should throw an error if the snapshot object conflicts with existing persistent fields', () => {
    const dice: SnapshotTestConflict = container.resolve(SnapshotTestConflict);

    expect(() => serializer.serialize(dice)).toThrow();
  });

  it('should serialize snapshot object', () => {
    const originalObject: SnapshotTestObject = container.resolve(SnapshotTestObject);
    originalObject.oval = 'man';

    const memento = serializer.serialize(originalObject);
    expect(memento).toEqual({pval: 'foo', oval: 'man'});

    const deserializedObject = serializer.restore(SnapshotTestObject, memento);
    expect(deserializedObject.pval).toBe('foo');
    expect(deserializedObject.oval).toBe('man');
  });
});
