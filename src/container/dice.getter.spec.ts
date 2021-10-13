import { dice } from "../annotations/scope-annotation";
import { contains, requires } from "../annotations/field-annotation";
import { createContainer } from "../container/container";
import { TestGetterTypes } from "./dice.getter.data.2.spec";
import { TestGetterParent } from "./dice.getter.data.spec";

export interface TestGetterShouter { shout(): string; }

@dice() class TestGetterOriginal {
  shout() { return 'foo'; }
}

@dice() class TestGetterSwapped {
  shout() { return 'bar'; }
}

@dice() class TestGetterGrandchild {
  @requires(TestGetterTypes.SHOUTER) public getShouter!: () => TestGetterShouter;
  @requires('test-getter-parent') public getParent!: () => TestGetterParent;

  shout() { return this.getShouter().shout(); }
}

@dice() export class TestGetterChild {
  @contains(TestGetterGrandchild) grandchild!: TestGetterGrandchild;
  @requires('test-getter-parent') public getParent!: () => TestGetterParent;
}

describe('Dice (getter)', () => {
  it('should provide via getter so that when the instance is swapped by the parent, the child gets the new instance.', () => {
    // setup
    const container = createContainer();
    const parent = container.resolve(TestGetterParent);
    parent.shouter = container.resolve(TestGetterOriginal);
    
    // test before swapping
    const grandchild = parent.child.grandchild;
    expect(grandchild.shout()).toBe('foo');

    // test after swapping
    parent.shouter = container.resolve(TestGetterSwapped);
    expect(grandchild.shout()).toBe('bar');
  });
  
  it('should be able to inject parent directly to child by tag', () => {
    // setup
    const container = createContainer();
    const parent = container.resolve(TestGetterParent);

    // test injecting parent into child
    expect(parent.child.getParent()).toBe(parent);
    expect(parent.child.grandchild.getParent()).toBe(parent);
  });
});
