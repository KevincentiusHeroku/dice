
import { Container } from "./container";
import { dice, prototype, provides, requires, singleton } from "./dices";

@dice()
class TestRequired {

}

@prototype()
class TestPrototype {
  // require
  private testRequired!: TestRequired;

  getRequired() {
    return this.testRequired;
  }
}

// dice
@dice()
class TestChild {
  // @requires(TestRequired)
  private testRequired!: TestRequired;

  getRequired() {
    return this.testRequired;
  }
}

// singleton
@singleton()
class TestParent {
  @provides(TestRequired) private testRequired!: TestRequired;
  // @requires(TestChild)
  private testChild!: TestChild;

  getChild() {
    return this.testChild;
  }

  getRequired() {
    return this.testRequired;
  }
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
  });
});
