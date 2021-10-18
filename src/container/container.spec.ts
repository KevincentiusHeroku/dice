import { contains, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { ContainerImpl, createContainer } from "./container";

@singleton()
class ContainerSpecRequiredSingleton {}

@dice()
class ContainerSpecContainedDice {}


@singleton('container-spec-singleton')
class ContainerSpecSingleton {
  @requires(ContainerSpecRequiredSingleton) public requiredSingleton!: ContainerSpecRequiredSingleton;
  @contains(ContainerSpecContainedDice) public containedDice!: ContainerSpecContainedDice;
}

@singleton('container-spec-tagged-service')
class ContainerSpecTaggedSingleton {}

@dice()
class ContainerSpecDice {
  @requires(ContainerSpecRequiredSingleton) public requiredSingleton!: ContainerSpecRequiredSingleton;
  @contains(ContainerSpecContainedDice) public containedDice!: ContainerSpecContainedDice;
}

@dice('container-spec-tagged-dice')
class ContainerSpecTaggedDice {
  @requires(ContainerSpecRequiredSingleton) public requiredSingleton!: ContainerSpecRequiredSingleton;
  @contains(ContainerSpecContainedDice) public containedDice!: ContainerSpecContainedDice;
}

@dice('container-spec-grandparent')
class ContainerSpecGrandparentDice {
  @contains(ContainerSpecTaggedDice) public taggedDice!: ContainerSpecTaggedDice;
}

@singleton('container-spec-duplicate-singleton')
class ContainerSpecDuplicateSingleton1 {}

@singleton('container-spec-duplicate-singleton')
class ContainerSpecDuplicateSingleton2 {}

@singleton('container-spec-duplicate-dice')
class ContainerSpecDuplicateDice1 {}

@singleton('container-spec-duplicate-dice')
class ContainerSpecDuplicateDice2 {}

describe('TestContainer', () => {
  it('should replace children of a dice if a replacement is given', () => {
    const mockSingleton = { foo: 'singleton' };
    const mockDice = { foo: 'dice' };
    const container = createContainer(new Map([
      [ContainerSpecRequiredSingleton, () => mockSingleton],
      [ContainerSpecContainedDice, () => mockDice],
    ]));

    const original = container.resolve(ContainerSpecDice);
    expect(original instanceof ContainerSpecDice).toBeTrue();

    expect(container.resolve(ContainerSpecRequiredSingleton)).toBe(mockSingleton);
    expect(container.resolve(ContainerSpecContainedDice)).toBe(mockDice);

    const resolved = container.resolve(ContainerSpecSingleton) as any;
    expect(resolved.requiredSingleton===mockSingleton).toBeTrue();
    expect(resolved.containedDice===mockDice).toBeTrue();

    const grandparent = container.resolve(ContainerSpecGrandparentDice);
    expect(grandparent.taggedDice.requiredSingleton===mockSingleton).toBeTrue();
    expect(grandparent.taggedDice.containedDice===mockDice).toBeTrue();
  });
});

describe('Container', () => {
  const container = createContainer() as ContainerImpl;

  it('should provide an autowired instance when queried for singleton by type', () => {
    const sing: ContainerSpecSingleton = container.resolveGetter(ContainerSpecSingleton)();
    expectAutowired(sing);
  });

  it('should provide the same instance everytime when queried for singleton by type', () => {
    let singleton1 = container.resolveGetter(ContainerSpecSingleton)();
    expect(singleton1 instanceof ContainerSpecSingleton).toBeTrue();
    expect(container.resolveGetter(ContainerSpecSingleton)()).toBe(singleton1);
    expect(container.resolveGetter('container-spec-singleton')()).toBe(singleton1);
    expect(container.resolve(ContainerSpecSingleton)).toBe(singleton1);
    expect(container.resolveTag('container-spec-singleton')).toBe(singleton1);
  });

  it('should provide the same instance everytime when queried for singleton by tag', () => {
    let singleton1 = container.resolveGetter('container-spec-tagged-service')();
    let singleton2 = container.resolveGetter('container-spec-tagged-service')();
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
  });

  it('should provide the same instance everytime when queried for singleton by either type or tag', () => {
    let singleton1 = container.resolveGetter(ContainerSpecTaggedSingleton)();
    let singleton2 = container.resolveGetter('container-spec-tagged-service')();
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
  });

  it('should provide an autowired instance when queried for dice by type', () => {
    const dice1 = container.resolveGetter(ContainerSpecDice)();
    expectAutowired(dice1);
  });

  it('should provide an autowired instance when queried for dice by tag', () => {
    const dice1 = container.resolveGetter('container-spec-tagged-dice')();
    expectAutowired(dice1);
  });

  it('should provide a new instance everytime when queried for dice by type', () => {
    let dice1 = container.resolveGetter(ContainerSpecDice)();
    let dice2 = container.resolveGetter(ContainerSpecDice)();
    expect(dice1 === dice2).toBeFalse();
    expect(dice1 instanceof ContainerSpecDice).toBeTrue();
  });

  it('should provide a new instance everytime when queried for dice by tag', () => {
    let dice1 = container.resolveGetter('container-spec-tagged-dice')();
    let dice2 = container.resolveGetter('container-spec-tagged-dice')();
    expect(dice1 === dice2).toBeFalse();
    expect(dice1 instanceof ContainerSpecTaggedDice).toBeTrue();
  });

  it('should throw an error if multiple instances matches the query', () => {
    expect(() => container.resolveGetter('container-spec-duplicate-singleton')).toThrow();
    expect(() => container.resolveGetter('container-spec-duplicate-dice')).toThrow();
    expect(() => container.resolveGetterDice({tag: 'container-spec-duplicate-dice'})).toThrow();
  });
});

function expectAutowired(sing: ContainerSpecSingleton) {
  expect(sing).toBeTruthy();
  expect(sing.requiredSingleton instanceof ContainerSpecRequiredSingleton).toBeTrue();
  expect(sing.containedDice instanceof ContainerSpecContainedDice).toBeTrue();
}

