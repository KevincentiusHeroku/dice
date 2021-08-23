
import { Container } from "./container";
import { dice, prototype, provides, requires, singleton } from "./dices";

@dice() class TestRequired {}
@singleton() class TestRequiredSingleton {}
@dice() class TestProvided {}

@prototype()
class TestPrototype {
  @requires(TestRequired) private testRequired!: TestRequired;

  getRequired() { return this.testRequired; }
}

@dice()
class TestChild {
  @requires(TestRequired) private testRequired!: TestRequired;
  @provides(TestRequired) private testRequired2!: TestRequired;
  @requires(TestRequiredSingleton) private testRequiredSingleton!: TestRequiredSingleton;

  getRequired() { return this.testRequired; }
  getRequired2() { return this.testRequired2; }
  getRequiredSingleton() { return this.testRequiredSingleton; }
}

@singleton()
class TestParent {
  @provides(TestRequired) private testRequired!: TestRequired;
  @provides(TestRequired) private testRequired2!: TestRequired;
  @requires(TestRequiredSingleton) private testRequiredSingleton!: TestRequiredSingleton;
  @requires(TestChild) private testChild!: TestChild;

  getChild() { return this.testChild; }
  getRequired() { return this.testRequired; }
  getRequired2() { return this.testRequired2; }
  getRequiredSingleton() { return this.testRequiredSingleton; }
}

class TestUnresolvable {}

describe(Container.name, () => {
  it('should throw an error when unable to resolve', () => {
    const container = new Container();
    expect(() => container.get(TestUnresolvable)).toThrow();
  });

  // singleton
  it('should return singleton instances', () => {
    const container = new Container();
    const testParent1 = container.get(TestParent);

    expect(testParent1).toBeTruthy();
  });

  it('should only create one instance for singletons', () => {
    const container = new Container();
    const testParent1 = container.get(TestParent);
    const testParent2 = container.get(TestParent);

    expect(testParent1 === testParent2).toBeTrue();
  });

  // prototype
  it('should return prototype instances', () => {
    const container = new Container();
    const testChild = container.get(TestPrototype);

    expect(testChild).toBeTruthy();
  });

  it('should create a new prototype instance every time, unlike singletons', () => {
    const container = new Container();
    const testChild1 = container.get(TestPrototype);
    const testChild2 = container.get(TestPrototype);

    expect(testChild1 === testChild2).toBeFalse();
  });

  it('should autowire prototypes', () => {
    const container = new Container();
    const testPrototype = container.get(TestPrototype);
    expect(testPrototype.getRequired()).toBeTruthy();
  });

  // dice
  it('should not return dice instances without providers', () => {
    const container = new Container();
    const testChild = container.get(TestChild);

    expect(testChild).toBeTruthy();
  });

  // dice hierarchy
  it('should automatically inject dices', () => {
    const container = new Container();
    const testParent = container.get(TestParent);
    expect(testParent.getChild()).toBeTruthy();
    expect(testParent.getRequired()).toBeTruthy();
    expect(testParent.getChild().getRequired()).toBeTruthy();
  });

  it('should inject the same singleton instance in both parent and child', () => {
    const container = new Container();
    const testParent = container.get(TestParent);
    expect(testParent.getRequiredSingleton() === testParent.getChild().getRequiredSingleton()).toBeTrue();
  });

  it('should inject the same dice instance in both parent and child because the parent @provides it and the child @requires it', () => {
    const container = new Container();
    const testParent = container.get(TestParent);
    expect(testParent.getRequired() === testParent.getChild().getRequired()).toBeTrue();
  });

  it('should inject the different dice instances in parent and child because both of them provides their own', () => {
    const container = new Container();
    const testParent = container.get(TestParent);
    expect(testParent.getRequired2() === testParent.getChild().getRequired2()).toBeFalse();
  });
});
