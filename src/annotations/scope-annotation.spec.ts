import { Scope, typeDescMap } from "./type-desc";
import { dice, singleton } from "./scope-annotation";

@dice('tag1', 'tag2')
class TestDice {
  testVal = '123';
}

@singleton('tag2', 'tag3')
class TestSingleton {
  testVal = '123';
}

describe('Dice annotation', () => {
  it('should register dice types', () => {
    let typeDesc = typeDescMap.get(TestDice);
    expect(typeDesc?.scope).toBe(Scope.DICE);
    expect(typeDesc?.type).toBe(TestDice);
    expect(typeDesc?.tags[0]).toBe('tag1');
    expect(typeDesc?.tags[1]).toBe('tag2');
  });

  it('should register singleton types', () => {
    let typeDesc = typeDescMap.get(TestSingleton);
    expect(typeDesc?.scope).toBe(Scope.SINGLETON);
    expect(typeDesc?.type).toBe(TestSingleton);
    expect(typeDesc?.tags[0]).toBe('tag2');
    expect(typeDesc?.tags[1]).toBe('tag3');
  });

  it('should report an error if a singleton type is registered multiple times', () => {
    expect(() => singleton()(TestSingleton)).toThrow();
  })

  it('should report an error if a dice type is registered multiple times', () => {
    expect(() => dice()(TestDice)).toThrow();
  })
});
