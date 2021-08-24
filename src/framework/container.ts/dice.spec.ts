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
  
  @requires(TProvChild) public tProvChild!: TProvChild;
  @requires(TProvParent) public tProvParent!: TProvParent;
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
  it('should work', () => {
    const tParent = root.get(TParent);
    expect(tParent).toBeTruthy();

    expectInstanceToBeInjectedProperly(tParent);
    expectInstanceToBeInjectedProperly(tParent.tChild);
    expectInstanceToBeInjectedProperly(tParent.tChild.tGrandchild);

    const elms = [
      tParent,
      tParent.tProvParent,
      tParent.tProvChild,
      tParent.tProvGrandchild,
      tParent.tChild,
      tParent.tChild.tProvChild,
      tParent.tChild.tProvGrandchild,
      tParent.tChild.tGrandchild,
      tParent.tChild.tGrandchild.tProvGrandchild,
    ];
    for (let i = 0; i < elms.length - 1; i++) {
      for (let j = i + 1; j < elms.length; j++) {
        expect(elms[i].tSingleton === elms[j].tSingleton)
          .withContext('@requires on a singleton field should be injected by the same singleton instance every time.')
          .toBeTrue();

        expect(elms[i].tProvLeaf === elms[j].tProvLeaf)
          .withContext('@provides should create a new instance every time (non-singleton).')
          .toBeFalse();
      }
    }
    
    const msgDiceRequiredInstance = 'When a descendant requires a dice, it should inject the same instance which has been provided by the nearest ancestor.';
    const msgDiceProvidedInstance = 'When a descendant provides its own dice, it should create a new instance instead of taking a provided instance.';
    // Only provided in parent:
    // parent - child = same
    expect(tParent.tProvParent === tParent.tChild.tProvParent)
      .withContext(msgDiceRequiredInstance)
      .toBeTrue();
    // parent - grandchild = same
    expect(tParent.tProvParent === tParent.tChild.tGrandchild.tProvParent)
      .withContext(msgDiceRequiredInstance)
      .toBeTrue();
    // child - grandchild = same
    expect(tParent.tChild.tProvParent === tParent.tChild.tGrandchild.tProvParent)
      .withContext(msgDiceRequiredInstance)
      .toBeTrue();
      
    // Provided in parent and child
    // parent - child = different
    expect(tParent.tProvChild === tParent.tChild.tProvChild)
      .withContext(msgDiceProvidedInstance)
      .toBeFalse();
    // parent - grandchild = different
    expect(tParent.tProvChild === tParent.tChild.tGrandchild.tProvChild)
      .withContext(msgDiceRequiredInstance)
      .toBeFalse();
    // child - grandchild = same
    expect(tParent.tChild.tProvChild === tParent.tChild.tGrandchild.tProvChild)
      .withContext(msgDiceRequiredInstance)
      .toBeTrue();
    
    // Provided in parent, child and grandchild
    // parent - child = different
    expect(tParent.tProvGrandchild === tParent.tChild.tProvGrandchild)
      .withContext(msgDiceProvidedInstance)
      .toBeFalse();
    // parent - grandchild = different
    expect(tParent.tProvGrandchild === tParent.tChild.tGrandchild.tProvGrandchild)
      .withContext(msgDiceProvidedInstance)
      .toBeFalse();
    // child - grandchild = different
    expect(tParent.tChild.tProvGrandchild === tParent.tChild.tGrandchild.tProvGrandchild)
      .withContext(msgDiceProvidedInstance)
      .toBeFalse();
  });

  function expectInstanceToBeInjectedProperly(instance: any) {
    expect(instance.tSingleton).toBeTruthy();
    expect(instance.tProvParent).toBeTruthy();
    expect(instance.tProvChild).toBeTruthy();
    expect(instance.tProvGrandchild).toBeTruthy();
    expect(instance.tSingleton).toBeTruthy();
  }
});
