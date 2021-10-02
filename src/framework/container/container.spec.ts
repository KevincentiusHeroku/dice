import { contains, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { Container } from "./container";

@singleton()
class ContainerSpecRequiredSingleton {}

@dice()
class ContainerSpecContainedDice {}


@singleton()
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

@dice('container-spec-duplicate-singleton')
class ContainerSpecDuplicateSingleton1 {}

@dice('container-spec-duplicate-singleton')
class ContainerSpecDuplicateSingleton2 {}

describe('Container', () => {
  it('should provide an autowired instance when queried for singleton by type', () => {
    const container = new Container();
    const sing: ContainerSpecSingleton = container.resolve(ContainerSpecSingleton);
    expectAutowired(sing);
  });

  it('should provide the same instance everytime when queried for singleton by type', () => {
    let container = new Container();

    let singleton1 = container.resolve(ContainerSpecSingleton);
    let singleton2 = container.resolve(ContainerSpecSingleton);
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecSingleton).toBeTrue();
  });

  it('should provide the same instance everytime when queried for singleton by tag', () => {
    let container = new Container();

    let singleton1 = container.resolve('container-spec-tagged-service');
    let singleton2 = container.resolve('container-spec-tagged-service');
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
  });

  it('should provide the same instance everytime when queried for singleton by either type or tag', () => {
    let container = new Container();

    let singleton1 = container.resolve(ContainerSpecTaggedSingleton);
    let singleton2 = container.resolve('container-spec-tagged-service');
    expect(singleton1 === singleton2).toBeTrue();
    expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
  });

  it('should provide an autowired instance when queried for dice by type', () => {
    const container = new Container();
    const dice1 = container.resolve(ContainerSpecDice);
    expectAutowired(dice1);
  });

  it('should provide an autowired instance when queried for dice by tag', () => {
    const container = new Container();
    const dice1 = container.resolve('container-spec-tagged-dice');
    expectAutowired(dice1);
  });

  it('should provide a new instance everytime when queried for dice by type', () => {
    let container = new Container();

    let dice1 = container.resolve(ContainerSpecDice);
    let dice2 = container.resolve(ContainerSpecDice);
    expect(dice1 === dice2).toBeFalse();
    expect(dice1 instanceof ContainerSpecDice).toBeTrue();
  });

  it('should provide a new instance everytime when queried for dice by tag', () => {
    let container = new Container();

    let dice1 = container.resolve('container-spec-tagged-dice');
    let dice2 = container.resolve('container-spec-tagged-dice');
    expect(dice1 === dice2).toBeFalse();
    expect(dice1 instanceof ContainerSpecTaggedDice).toBeTrue();
  });

  it('should throw an error if multiple instances matches the query', () => {
    let container = new Container();

    expect(() => container.resolve('container-spec-duplicate-singleton')).toThrow();
  })
});
function expectAutowired(sing: ContainerSpecSingleton) {
  expect(sing).toBeTruthy();
  expect(sing.requiredSingleton instanceof ContainerSpecRequiredSingleton).toBeTrue();
  expect(sing.containedDice instanceof ContainerSpecContainedDice).toBeTrue();
}

