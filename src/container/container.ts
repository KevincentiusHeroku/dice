import { Dice } from "./dice";
import { Provider } from "./provider";
import { createQuery, diceMap, DiceQuery, initializeTypeDescMap, Scope, Type, typeDescByTag, typeDescMap } from "../annotations/type-desc";

export interface Container {
  resolve<T>(type: Type<T>): T;
  resolveTag(tag: any): any;
}

export class ContainerImpl implements Container {
  private provider: Provider = new Provider();

  constructor(private replacementMap?: Map<any, any>) {
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
    return this.resolveGetter(type)();
  }

  resolveTag(tag: any): any {
    return this.resolveGetter(tag)();
  }

  resolveGetter(identifier: Type<any> | any): () => any {
    return this.resolveGetterQuery(createQuery(identifier));
  }

  /** This method only resolves dices. For singletons or replacements, resolveGetterQuery should be used. */
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
      } else {
        throw new Error(`Cannot resolve dice because ${candidates ? candidates.length : 0} dices were found for tag ${diceQuery.tag}`);
      }
    }
  }

  resolveGetterQuery(diceQuery: DiceQuery): () => any {
    // replacement (mocks)
    const replacement = this.getReplacement(diceQuery);
    if (replacement) {
      return replacement;
    }

    // singleton
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided) {
      return selfProvided;
    }
    
    // dice
    return this.resolveGetterDice(diceQuery, null);
  }

  getReplacement(diceQuery: DiceQuery): (() => any) | null {
    if (this.replacementMap) {
      return this.replacementMap.get(diceQuery.tag ?? diceQuery.type);
    } else {
      return null;
    }
  }
}

export function createContainer(replacementMap?: Map<any, any>): Container {
  return new ContainerImpl(replacementMap);
}
