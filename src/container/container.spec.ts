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

@singleton('container-spec-duplicate-singleton')
class ContainerSpecDuplicateSingleton1 {}

@singleton('container-spec-duplicate-singleton')
class ContainerSpecDuplicateSingleton2 {}

@singleton('container-spec-duplicate-dice')
class ContainerSpecDuplicateDice1 {}

@singleton('container-spec-duplicate-dice')
class ContainerSpecDuplicateDice2 {}

describe('Container', () => {
  const container = createContainer() as ContainerImpl;

  it('should provide an autowired instance when queried for singleton by type', () => {
    const sing: ContainerSpecSingleton = container.resolveIdentifier(ContainerSpecSingleton);
    expectAutowired(sing);
  });

  it('should provide the same instance everytime when queried for singleton by type', () => {
    let singleton1 = container.resolveIdentifier(ContainerSpecSingleton);
    expect(singleton1 instanceof ContainerSpecSingleton).toBeTrue();
    expect(container.resolveIdentifier(ContainerSpecSingleton)).toBe(singleton1);
    expect(container.resolve(ContainerSpecSingleton)).toBe(singleton1);
    expect(container.resolveTag('container-spec-singleton')).toBe(singleton1);
  });

  it('should provide the same instance everytime when queried for singleton by tag', () => {
    let singleton1 = container.resolveIdentifier('container-spec-tagged-service');
    let singleton2 = container.resolveIdentifier('container-spec-tagged-service');
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
  });

  it('should provide the same instance everytime when queried for singleton by either type or tag', () => {
    let singleton1 = container.resolveIdentifier(ContainerSpecTaggedSingleton);
    let singleton2 = container.resolveIdentifier('container-spec-tagged-service');
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
  });

  it('should provide an autowired instance when queried for dice by type', () => {
    const dice1 = container.resolveIdentifier(ContainerSpecDice);
    expectAutowired(dice1);
  });

  it('should provide an autowired instance when queried for dice by tag', () => {
    const dice1 = container.resolveIdentifier('container-spec-tagged-dice');
    expectAutowired(dice1);
  });

  it('should provide a new instance everytime when queried for dice by type', () => {
    let dice1 = container.resolveIdentifier(ContainerSpecDice);
    let dice2 = container.resolveIdentifier(ContainerSpecDice);
    expect(dice1 === dice2).toBeFalse();
    expect(dice1 instanceof ContainerSpecDice).toBeTrue();
  });

  it('should provide a new instance everytime when queried for dice by tag', () => {
    let dice1 = container.resolveIdentifier('container-spec-tagged-dice');
    let dice2 = container.resolveIdentifier('container-spec-tagged-dice');
    expect(dice1 === dice2).toBeFalse();
    expect(dice1 instanceof ContainerSpecTaggedDice).toBeTrue();
  });

  it('should throw an error if multiple instances matches the query', () => {
    expect(() => container.resolveIdentifier('container-spec-duplicate-singleton')).toThrow();
    expect(() => container.resolveIdentifier('container-spec-duplicate-dice')).toThrow();
    expect(() => container.resolveGetterDice({tag: 'container-spec-duplicate-dice'})).toThrow();
  });
});

function expectAutowired(sing: ContainerSpecSingleton) {
  expect(sing).toBeTruthy();
  expect(sing.requiredSingleton instanceof ContainerSpecRequiredSingleton).toBeTrue();
  expect(sing.containedDice instanceof ContainerSpecContainedDice).toBeTrue();
}

