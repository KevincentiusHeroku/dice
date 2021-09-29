import { Scope, typeDescMap } from "../container/type-desc";
import { singleton } from "./scope-annotation";

@singleton()
class TestSingleton {
  testVal = '123';
}

describe('Singleton annotation', () => {
  it('should register singleton types', () => {
    let typeDesc = typeDescMap.get(TestSingleton);
    expect(typeDesc?.scope).toBe(Scope.SINGLETON);
    expect(typeDesc?.type).toBe(TestSingleton);
  });
});
