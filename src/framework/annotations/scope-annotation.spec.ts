import { Scope, typeDescMap } from "../container/type-desc";
import { dice, singleton } from "./scope-annotation";

@dice('tag1', 'tag2')
class TestDice {
  testVal = '123';
}

@singleton('tag3', 'tag4')
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
    expect(typeDesc?.tags[0]).toBe('tag3');
    expect(typeDesc?.tags[1]).toBe('tag4');
  });
});
