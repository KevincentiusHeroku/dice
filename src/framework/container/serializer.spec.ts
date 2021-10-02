import { contains, persistent, provides, requires } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { Container } from "./container";
import { Dice } from "./dice";
import { Serializer } from "./serializer";

@dice()
class TestSerializationSimple {
  @persistent()
  public val = 'cereal';

  @persistent()
  public obj: any = {
    num: 5,
    str: 'cake',
    map: new Map(),
    inn: {
      arr: ['one', 'two', 'three'],
      set: new Set([4, 5, 6]),
    }
  };
}

@dice()
class TestSerializationProvided {
  @persistent()
  public val = ['test1', 'test2', 'test3'];
}

@singleton()
class TestSerializedRequired {
  
}

@dice()
class TestSerializationParent {
  @contains(TestSerializationSimple) simple!: TestSerializationSimple;
  @provides(TestSerializationProvided) provided!: TestSerializationProvided;
  @requires(TestSerializedRequired) required!: TestSerializedRequired;

  @persistent()
  public val = 'bottle';
}

describe(Dice.name + ' (serialization)', () => {
  it('should serialize @persistent fields in a dice', () => {
    const container = new Container();
    const serializer: Serializer = container.resolve(Serializer);
    
    const before = container.resolve(TestSerializationSimple);
    const memento = serializer.serialize(before);

    expect(expectSimpleMemento(memento)).toBeTrue();
  });

  it('should recursively serialize @contains and @provides fields in a dice, but not @requires fields', () => {
    const container = new Container();
    const serializer: Serializer = container.resolve(Serializer);

    const before = container.resolve(TestSerializationParent);
    const memento = serializer.serialize(before);

    expect(memento.val).toBe('bottle');
    expect(expectSimpleMemento(memento.simple)).toBeTrue();
    expect(memento.provided.val[1]).toBe('test2');
    expect(memento.required).toBeFalsy();
  });
  
  it('should restore the values of @persistent fields in a dice', () => {
    const container = new Container();
    const serializer: Serializer = container.resolve(Serializer);
    
    const val = [5,7,9];
    const memento = {
      obj: val
    };
    const after: TestSerializationSimple = serializer.restore(TestSerializationSimple, memento)!;
    expect(after.obj).toBe(val);
  });

  it('should recursively restore @contains and @provides fields and autowire @requires fields', () => {
    const container = new Container();
    const serializer: Serializer = container.resolve(Serializer);
    
    const testProvided = ['test4', 'test5', 'test6'];
    const memento = {
      simple: { obj: 'testSimple', val: 'button' },
      provided: { val: testProvided },
      val: 'fridge',
    };
    const after: TestSerializationParent = serializer.restore(TestSerializationParent, memento);

    expect(after.val).toBe('fridge');
    expect(after.simple.val).toBe('button');
    expect(after.simple.obj).toBe('testSimple');
    expect(after.provided.val).toBe(testProvided);
    expect(after.required).toBe(container.resolve(TestSerializedRequired));
  });

  function expectSimpleMemento(memento: any) {
    expect(memento.val).toBe('cereal');
    expect(memento.obj.inn.arr[2]).toBe('three');
    expect(memento.obj.inn.set.has(5)).toBeTrue();
    return true;
  }  
});