import { dice, singleton } from "../annotations/scope-annotation";
import { Container } from "./container";

@singleton()
class ContainerSpecSingleton {}

@singleton('container-spec-tagged-service')
class ContainerSpecTaggedSingleton {}

@dice()
class ContainerSpecDice {}

@dice('container-spec-tagged-dice')
class ContainerSpecTaggedDice {}

describe('Container', () => {
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
});
