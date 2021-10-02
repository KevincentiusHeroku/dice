import { provides, requires } from "../annotations/field-annotation";
import { dice } from "../annotations/scope-annotation";
import { Container } from "../container/container";
import { Serializer } from "./serializer";

enum Types {
  SHOUTER = 'serializer-child-test-shouter',
}

interface Shouter { shout(): string; }

@dice(Types.SHOUTER) class SerializerChildTestFoo implements Shouter { shout() { return 'foo'; }}
@dice(Types.SHOUTER) class SerializerChildTestBar implements Shouter { shout() { return 'bar'; }}

@dice() class SerializerChildTestChild {
  @requires(Types.SHOUTER) shouter!: Shouter;
}

@dice() class SerializerChildTestParent1 {
  @provides(SerializerChildTestFoo, Types.SHOUTER) foo!: SerializerChildTestFoo;
}

@dice() class SerializerChildTestParent2 {
  @provides(SerializerChildTestBar, Types.SHOUTER) bar!: SerializerChildTestBar;
}

describe(Serializer.name + ' (child)', () => {
  it('should ', () => {
    const container = new Container();
    const serializer: Serializer = container.resolve(Serializer);
    const parent1 = container.resolve(SerializerChildTestParent1);
    const parent2 = container.resolve(SerializerChildTestParent2);
    const memento = {};

    expect(serializer.restore(SerializerChildTestChild, memento, parent1).shouter.shout()).toBe('foo');
    expect(serializer.restore(SerializerChildTestChild, memento, parent2).shouter.shout()).toBe('bar');
  });
});
