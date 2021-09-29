import { Dice } from "./dice";
import { Provider } from "./provider";
import { createQuery, diceMap, DiceQuery, initializeTypeDescMap, Scope, Type, typeDescByTag, typeDescMap } from "./type-desc";

export class Container {
  private provider: Provider = new Provider();

  constructor() {
    initializeTypeDescMap();

    // construct singletons
    typeDescMap.forEach((typeDesc, type) => {
      if (typeDesc.scope === Scope.SINGLETON) {
        const dice = new Dice(this, null, typeDesc);
        this.provider.register(typeDesc.type, dice.getInstance(), ...typeDesc.tags);
      }
    });

    // autowire singletons
    typeDescMap.forEach((typeDesc, type) => {
      if (typeDesc.scope === Scope.SINGLETON) {
        const instance = this.provider.get({type});
        diceMap.get(instance)!.autowire();
      }
    });
  }

  resolve(identifier: Type<any> | any) {
    return this.resolveQuery(createQuery(identifier));
  }

  resolveQuery(diceQuery: DiceQuery): any {
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided)
      // singleton
      return selfProvided;
    else if (diceQuery.type)
      // get dice by type
      return new Dice(this, null, typeDescMap.get(diceQuery.type)!).getInstance();
    else {
      // get dice by tag
      const candidates = typeDescByTag.get(diceQuery.tag)!;
      if (candidates.length === 1)
        return new Dice(this, null, candidates[0]).getInstance();
      else
        throw new Error(`Cannot resolve dice because ${candidates.length} dices were found for tag ${diceQuery.tag}`);
    }
  }
}
