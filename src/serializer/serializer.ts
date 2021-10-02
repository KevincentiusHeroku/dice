
import { singleton } from "../annotations/scope-annotation";
import { createQuery, diceMap, Type } from "../annotations/type-desc";

export interface Serializable {
  snapshot?(): any;
  restore?(): any;
}

@singleton()
export class Serializer {
  serialize(instance: any): any {
    const typeDesc = diceMap.get(instance)!.getTypeDesc();
    
    const memento: any = {};
    [typeDesc.containsMap, typeDesc.providesMap].forEach(compositionMap => {
      for (const propertyKey of compositionMap.keys()) {
        memento[propertyKey] = this.serialize(instance[propertyKey]);
      }
    });

    for (const propertyKey of typeDesc.persistentFields.keys()) {
      memento[propertyKey] = instance[propertyKey];
    }

    if (this.hasSnapshot(instance)) {
      memento.snapshot = instance.snapshot();
    }

    return memento;
  }

  restore<T>(type: Type<T>, memento: any, parent?: any) {
    const instance: any = diceMap.get(this)!.getContainer().resolveDice(createQuery(type), diceMap.get(parent));

    this.recursiveRestore(instance, memento);

    return instance;
  }

  private restorePersistentFields(instance: any, memento: any) {
    const typeDesc = diceMap.get(instance)!.getTypeDesc();

    typeDesc.persistentFields.forEach(propertyKey => {
      instance[propertyKey] = memento[propertyKey];
    });
  }
  
  private recursiveRestore(instance: any, memento: any) {
    const typeDesc = diceMap.get(instance)!.getTypeDesc();
    
    // recursively restore @contains and @provides fields
    [typeDesc.containsMap, typeDesc.providesMap].forEach(compositionMap => {
      compositionMap.forEach((val, propertyKey) => {
        this.recursiveRestore(instance[propertyKey], memento[propertyKey]);
      });
    });

    // restore current instance
    this.restorePersistentFields(instance, memento);

    if (memento.snapshot) {
      instance.restore(memento.snapshot);
    }
  }

  private hasSnapshot(instance: any) {
    return instance.snapshot instanceof Function && instance.restore instanceof Function;
  }
}
