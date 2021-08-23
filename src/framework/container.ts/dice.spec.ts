import { dice, provides, requires, singleton } from "./annotation";
import root, { Dice } from "./dice";

class TUnregistered {}

@dice() class TProvLeaf {}

@singleton() class TSingleton {
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;
}

@dice() class TProvParent {
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;
  @requires(TSingleton) public tSingleton!: TSingleton;
}

@dice() class TProvChild {
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;
  @requires(TSingleton) public tSingleton!: TSingleton;
}

@dice() class TProvGrandchild {
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;
  @requires(TSingleton) public tSingleton!: TSingleton;
}

@dice() class TGrandchild {
  @provides(TProvGrandchild) public tProvGrandchild!: TProvGrandchild;
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;
  
  @requires(TProvChild) public tProvParent!: TProvChild;
  @requires(TProvParent) public tProvChild!: TProvParent;
  @requires(TSingleton) public tSingleton!: TSingleton;
}

@dice() class TChild {
  @provides(TGrandchild) public tGrandchild!: TGrandchild;
  @provides(TProvChild) public tProvChild!: TProvChild;
  @provides(TProvGrandchild) public tProvGrandchild!: TProvGrandchild;
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;
  
  @requires(TProvParent) public tProvParent!: TProvParent;
  @requires(TSingleton) public tSingleton!: TSingleton;
}

@singleton() class TParent {
  @provides(TChild) public tChild!: TChild;
  @provides(TProvParent) public tProvParent!: TProvParent;
  @provides(TProvChild) public tProvChild!: TProvChild;
  @provides(TProvGrandchild) public tProvGrandchild!: TProvGrandchild;
  @provides(TProvLeaf) public tProvLeaf!: TProvLeaf;

  @requires(TSingleton) public tSingleton!: TSingleton;
}

describe(Dice.name, () => {
  it('should', () => {
    const tParent = root.get(TParent);
    expect(tParent).toBeTruthy();
  });
});
