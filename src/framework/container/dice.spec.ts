import { provides, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { Container } from "./container";

@dice() class DiceTestProvidedByAll {}
@dice() class DiceTestProvidedByChild {}
@dice() class DiceTestProvidedByParent {}
@singleton() class DiceTestSingleton {}

@dice() class DiceTestGrandchild {
  @provides(DiceTestProvidedByAll) public providedByAll!: DiceTestProvidedByAll;
  @requires(DiceTestProvidedByChild) public providedByChild!: DiceTestProvidedByChild;
  @requires(DiceTestProvidedByParent) public providedByParent!: DiceTestProvidedByParent;

  @requires(DiceTestSingleton) public singleton!: DiceTestSingleton;
}

@dice() class DiceTestChild {
  @provides(DiceTestProvidedByAll) public providedByAll!: DiceTestProvidedByAll;
  @provides(DiceTestProvidedByChild) public providedByChild!: DiceTestProvidedByChild;
  @requires(DiceTestProvidedByParent) public providedByParent!: DiceTestProvidedByParent;

  @requires(DiceTestSingleton) public singleton!: DiceTestSingleton;
  @provides(DiceTestGrandchild) public grandChild!: DiceTestGrandchild;
}

@singleton() class DiceTestParent {
  @provides(DiceTestProvidedByAll) public providedByAll!: DiceTestProvidedByAll;
  @provides(DiceTestProvidedByChild) public providedByChild!: DiceTestProvidedByChild;
  @provides(DiceTestProvidedByParent) public providedByParent!: DiceTestProvidedByParent;

  @requires(DiceTestSingleton) public singleton!: DiceTestSingleton;
  @provides(DiceTestChild) public child!: DiceTestChild;
}

describe('Dice', () => {
  it('should recursively autowire dices', () => {
    const container = new Container();

    const sing: DiceTestSingleton = container.resolve(DiceTestSingleton);
    expect(sing instanceof DiceTestSingleton).toBeTrue();

    const parent: DiceTestParent = container.resolve(DiceTestParent);
    expect(parent instanceof DiceTestParent).toBeTrue();
    expect(parent.singleton).toBe(sing);
    expect(parent.providedByParent instanceof DiceTestProvidedByParent).toBeTrue();
    expect(parent.providedByChild instanceof DiceTestProvidedByChild).toBeTrue();
    expect(parent.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();

    const child = parent.child;
    expect(child instanceof DiceTestChild).toBeTrue();
    expect(child.singleton).toBe(sing);
    expect(child.providedByParent).toBe(parent.providedByParent);
    expect(child.providedByChild instanceof DiceTestProvidedByChild).toBeTrue();
    expect(child.providedByChild == parent.providedByChild).toBeFalse();
    expect(child.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
    expect(child.providedByAll == parent.providedByAll).toBeFalse();

    const grandChild = child.grandChild;
    expect(grandChild instanceof DiceTestGrandchild).toBeTrue();
    expect(grandChild.singleton).toBe(sing);
    expect(grandChild.providedByParent).toBe(parent.providedByParent);
    expect(grandChild.providedByChild).toBe(child.providedByChild);
    expect(grandChild.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
    expect(grandChild.providedByAll == parent.providedByAll).toBeFalse();
    expect(grandChild.providedByAll == child.providedByAll).toBeFalse();
  });
});
