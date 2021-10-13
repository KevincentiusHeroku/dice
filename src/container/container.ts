import { Dice } from "./dice";
import { Provider } from "./provider";
import { createQuery, diceMap, DiceQuery, initializeTypeDescMap, Scope, Type, typeDescByTag, typeDescMap } from "../annotations/type-desc";

export interface Container {
  resolve<T>(type: Type<T>): T;
  resolveTag(tag: any): any;
}

export class ContainerImpl {
  private provider: Provider = new Provider();

  constructor() {
    initializeTypeDescMap();

    // construct singletons
    typeDescMap.forEach((typeDesc, type) => {
      if (typeDesc.scope === Scope.SINGLETON) {
        const dice = new Dice(this, null, typeDesc);
        this.provider.register(typeDesc.type, () => dice.getInstance(), ...typeDesc.tags);
      }
    });

    // autowire singletons
    typeDescMap.forEach((typeDesc, type) => {
      if (typeDesc.scope === Scope.SINGLETON) {
        const getter = this.provider.get({type});
        diceMap.get(getter())!.autowire();
      }
    });
  }

  resolve<T>(type: Type<T>): T {
    return this.resolveIdentifier(type);
  }

  resolveTag(tag: any): any {
    return this.resolveIdentifier(tag);
  }

  resolveIdentifier(identifier: Type<any> | any): any {
    return this.resolveGetter(identifier)();
  }

  resolveGetter(identifier: Type<any> | any): () => any {
    return this.resolveGetterQuery(createQuery(identifier));
  }

  resolveGetterDice(diceQuery: DiceQuery, parent?: any): () => any {
    if (diceQuery.type) {
      // get dice by type
      const dice = new Dice(this, parent, typeDescMap.get(diceQuery.type)!);
      dice.autowire();
      return () => dice.getInstance();
    } else {
      // get dice by tag
      const candidates = typeDescByTag.get(diceQuery.tag)!;
      if (candidates && candidates.length === 1) {
        const dice = new Dice(this, parent, candidates[0]);
        dice.autowire();
        return () => dice.getInstance();
      } else
        throw new Error(`Cannot resolve dice because ${candidates ? candidates.length : 0} dices were found for tag ${diceQuery.tag}`);
    }
  }

  resolveGetterQuery(diceQuery: DiceQuery): () => any {
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided)
      // singleton
      return selfProvided;
    else
      return this.resolveGetterDice(diceQuery, null);
  }
}

export function createContainer(): Container {
  return new ContainerImpl();
}
