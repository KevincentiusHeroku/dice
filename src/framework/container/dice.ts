import { Container } from "./container";
import { Provider } from "./provider";
import { diceMap, DiceQuery, TypeDesc, typeDescMap } from "./type-desc";

export class Dice<T> {
  private instance: any;
  private provider: Provider = new Provider();
  
  constructor(
    private container: Container,
    private parent: Dice<any> | null,
    private typeDesc: TypeDesc<T>
  ) {
    this.instance = new typeDesc.type();
    diceMap.set(this.instance, this);
    
    this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
      const providesTypeDesc = typeDescMap.get(providesData.type)!;
      let childDice = new Dice(this.container, this, providesTypeDesc);
      this.instance[propertyKey] = childDice.instance;

      this.provider.register(providesTypeDesc.type, childDice.instance, ...new Set(providesTypeDesc.tags.concat(providesData.tags)));
    });
  }

  getInstance(): any {
    return this.instance;
  }
  
  autowire() {
    // recursive autowiring of @provides fields
    this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
      diceMap.get(this.instance[propertyKey])!.autowire();
    });

    // resolve @requires field
    this.typeDesc.requiresMap.forEach((diceQuery, propertyKey) => {
      if (this.parent) {
        this.instance[propertyKey] = this.parent.resolveQuery(diceQuery);
      } else {
        this.instance[propertyKey] = this.container.resolveQuery(diceQuery);
      }
    });
  }

  resolveQuery(diceQuery: DiceQuery): any {
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided)
      return selfProvided;
    else if (this.parent)
      return this.parent.resolveQuery(diceQuery);
    else
      return this.container.resolveQuery(diceQuery);
  }
}
