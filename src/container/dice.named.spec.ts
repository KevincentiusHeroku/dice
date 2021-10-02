import { provides, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { Container } from "./container";
import { Dice } from "./dice";

interface TestNamedProvided {
  get(): number;
}

@dice("test-named-provided-3") class TestNamedProvided3 implements TestNamedProvided { get() { return 3; } }
@dice("test-named-provided-2") class TestNamedProvided2 implements TestNamedProvided { get() { return 2; } }
@dice("test-named-provided-1") class TestNamedProvided1 implements TestNamedProvided { get() { return 1; } }

@dice() class TestNamedCalc3 {
  @provides(TestNamedProvided3) public provided3!: TestNamedProvided3;
  @requires("test-named-provided-2") public provided2!: TestNamedProvided;
  @requires("test-named-provided-1") public provided1!: TestNamedProvided;
}

@dice() class TestNamedCalc2 {
  @provides(TestNamedProvided2) public provided2!: TestNamedProvided2;
  @requires("test-named-provided-1") public provided1!: TestNamedProvided;
  @provides(TestNamedCalc3) public calc3!: TestNamedCalc3;
}

@singleton("test-named-calc-1") class TestNamedCalc1 {
  @provides(TestNamedProvided1) public provided1!: TestNamedProvided1;
  @provides(TestNamedCalc2) public calc2!: TestNamedCalc2;
}

describe(Dice.name + ' (named)', () => {
  it('should recursively autowire named dices', () => {
    const container = new Container();
    const calc1: TestNamedCalc1 = container.resolve("test-named-calc-1");

    expect(calc1 instanceof TestNamedCalc1).toBeTrue();
    expect(calc1.provided1 instanceof TestNamedProvided1).toBeTrue();

    const calc2 = calc1.calc2;
    expect(calc2 instanceof TestNamedCalc2).toBeTrue();
    expect(calc2.provided1).toBe(calc1.provided1);
    expect(calc2.provided2 instanceof TestNamedProvided2).toBeTrue();
    
    const calc3 = calc2.calc3;
    expect(calc3 instanceof TestNamedCalc3).toBeTrue();
    expect(calc3.provided1).toBe(calc1.provided1);
    expect(calc3.provided2).toBe(calc2.provided2);
    expect(calc3.provided3 instanceof TestNamedProvided3).toBeTrue();
  });
});
