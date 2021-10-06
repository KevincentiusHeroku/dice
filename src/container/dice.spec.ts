import { contains, provides, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { ContainerImpl, createContainer } from "./container";
import { Dice } from "./dice";
import { DiceTestParent } from "./dice.data.spec";

@dice() export class DiceTestProvidedByAll {}
@dice() export class DiceTestProvidedByChild {}
@dice() export class DiceTestProvidedByParent {}
@dice() export class DiceTestProvidedByParentOnly {
  @contains(DiceTestProvidedByAll) providedByAll!: DiceTestProvidedByAll;
}
@singleton() export class DiceTestSingleton {}

@dice() export class DiceTestGrandchild {
  @provides(DiceTestProvidedByAll) public providedByAll!: DiceTestProvidedByAll;
  @requires(DiceTestProvidedByChild) public providedByChild!: DiceTestProvidedByChild;
  @requires(DiceTestProvidedByParent) public providedByParent!: DiceTestProvidedByParent;
  @requires(DiceTestProvidedByParentOnly) public providedByParentOnly!: DiceTestProvidedByParentOnly;

  @requires(DiceTestSingleton) public singleton!: DiceTestSingleton;
}

@dice() export class DiceTestChild {
  @provides(DiceTestProvidedByAll) public providedByAll!: DiceTestProvidedByAll;
  @provides(DiceTestProvidedByChild) public providedByChild!: DiceTestProvidedByChild;
  @requires(DiceTestProvidedByParent) public providedByParent!: DiceTestProvidedByParent;
  @contains(DiceTestProvidedByParentOnly) public providedByParentOnly!: DiceTestProvidedByParentOnly;

  @requires(DiceTestSingleton) public singleton!: DiceTestSingleton;
  @provides(DiceTestGrandchild) public grandChild!: DiceTestGrandchild;
  @requires('dice-test-parent') public parent!: DiceTestParent;
}

describe(Dice.name, () => {
  it('should recursively autowire dices', () => {
    const container = createContainer();

    const sing: DiceTestSingleton = container.resolve(DiceTestSingleton);
    expect(sing instanceof DiceTestSingleton).toBeTrue();

    const parent: DiceTestParent = container.resolve(DiceTestParent);
    expect(parent instanceof DiceTestParent).toBeTrue();
    expect(parent.singleton).toBe(sing);
    expect(parent.providedByParent instanceof DiceTestProvidedByParent).toBeTrue();
    expect(parent.providedByChild instanceof DiceTestProvidedByChild).toBeTrue();
    expect(parent.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
    expect(parent.providedByParentOnly instanceof DiceTestProvidedByParentOnly).toBeTrue();

    const child = parent.child;
    expect(child instanceof DiceTestChild).toBeTrue();
    expect(child.singleton).toBe(sing);
    expect(child.providedByParent).toBe(parent.providedByParent);
    expect(child.providedByChild instanceof DiceTestProvidedByChild).toBeTrue();
    expect(child.providedByChild == parent.providedByChild).toBeFalse();
    expect(child.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
    expect(child.providedByAll == parent.providedByAll).toBeFalse();
    expect(child.providedByParentOnly instanceof DiceTestProvidedByParentOnly).toBeTrue();
    expect(child.providedByParentOnly == parent.providedByParentOnly)
      .withContext('child declares the field with @contains rather than @requires, so it should get a new instance')
      .toBeFalse();
    expect(child.parent).toBe(parent);

    const grandChild = child.grandChild;
    expect(grandChild instanceof DiceTestGrandchild).toBeTrue();
    expect(grandChild.singleton).toBe(sing);
    expect(grandChild.providedByParent).toBe(parent.providedByParent);
    expect(grandChild.providedByChild).toBe(child.providedByChild);
    expect(grandChild.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
    expect(grandChild.providedByAll == parent.providedByAll).toBeFalse();
    expect(grandChild.providedByAll == child.providedByAll).toBeFalse();
    expect(grandChild.providedByParentOnly instanceof DiceTestProvidedByParentOnly).toBeTrue();
    expect(grandChild.providedByParentOnly == parent.providedByParentOnly)
      .withContext('child declares the field with @contains rather than @provides, so it doesn\'t resolve the query and bubbles the query up to the parent')
      .toBeTrue();

    expect(parent.providedByParentOnly.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
  });
});
