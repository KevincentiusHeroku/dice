import { contains, persistent, provides, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { initializeTypeDescMap, typeDescMap } from "../container/type-desc";

@dice('tag-grandchild')
class TestDiceGrandchild {}

@dice('tag-child')
class TestDiceChild {
  @provides(TestDiceGrandchild) grandchild!: TestDiceGrandchild;
}

@dice('tag-contained')
class TestDiceContained {}

@dice()
class TestDiceEmpty {}

@singleton('tag-candy')
class TestCandy {}

@singleton('tag-singleton')
class TestSingleton {
  @contains(TestDiceContained) contained!: TestDiceContained;
  @provides(TestDiceChild) child!: TestDiceChild;
  @requires(TestCandy) candy!: TestCandy;
  @persistent() myVal = 5;
  @persistent() myObj = { arr: [1,2,3], map: new Map() };
}

describe('Dice annotation', () => {
  it('should register dice types', () => {
    initializeTypeDescMap();

    expect(typeDescMap.get(TestSingleton)?.containsMap.get('contained')).toBe(TestDiceContained);
    expect(typeDescMap.get(TestSingleton)?.providesMap.get('child')?.type).toBe(TestDiceChild);
    expect(typeDescMap.get(TestSingleton)?.requiresMap.get('candy')?.type).toBe(TestCandy);
    expect(typeDescMap.get(TestSingleton)?.persistentFields.has('myVal')).toBeTrue();
    expect(typeDescMap.get(TestSingleton)?.persistentFields.has('myObj')).toBeTrue();

    expect(typeDescMap.get(TestDiceChild)?.providesMap.get('grandchild')?.type).toBe(TestDiceGrandchild);

    expect(typeDescMap.get(TestDiceEmpty)?.providesMap).toBeTruthy();
    expect(typeDescMap.get(TestDiceEmpty)?.requiresMap).toBeTruthy();
  });
});
