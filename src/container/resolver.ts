
import { Container } from "./container";
import { createQuery, diceMap, Type } from "../annotations/type-desc";
import { Dice } from "./dice";

class Resolver implements Container {
  constructor(
    private dice: Dice<any>
  ) {}

  resolve<T>(type: Type<T>): T {
    return this.dice.resolveGetterQuery(createQuery(type))();
  }
  
  resolveTag(tag: any) {
    return this.dice.resolveGetterQuery(createQuery(tag))();
  }
}

export function getResolver(instance: any): Container {
  return new Resolver(diceMap.get(instance)!);
}
