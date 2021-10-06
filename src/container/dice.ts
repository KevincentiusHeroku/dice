import { ContainerImpl } from "./container";
import { Provider } from "./provider";
import { diceMap, DiceQuery, TypeDesc, typeDescMap } from "../annotations/type-desc";

export class Dice<T> {
  private instance: any;
  private provider: Provider = new Provider();
  
  constructor(
    private container: ContainerImpl,
    private parent: Dice<any> | null,
    private typeDesc: TypeDesc<T>
  ) {
    this.instance = new typeDesc.type();
    diceMap.set(this.instance, this);
    
    this.provider.register(this.typeDesc.type, () => this.instance, this.typeDesc.tags);

    // preconstruct provided dices
    this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
      const providesTypeDesc = typeDescMap.get(providesData.type)!;
      let childDice = new Dice(this.container, this, providesTypeDesc);
      this.instance[propertyKey] = childDice.instance;

      this.provider.register(providesTypeDesc.type, () => childDice.instance, ...new Set(providesTypeDesc.tags.concat(providesData.tags)));
    });

    // preconstruct contained dices
    this.typeDesc.containsMap.forEach((containsType, propertyKey) => {
      const containsTypeDesc = typeDescMap.get(containsType)!;
      let childDice = new Dice(this.container, this, containsTypeDesc);
      this.instance[propertyKey] = childDice.instance;
    });
  }

  getContainer() { return this.container; }
  getTypeDesc() { return this.typeDesc; }
  getInstance() { return this.instance; }
  
  autowire() {
    // recursive autowiring of @contains fields
    this.typeDesc.containsMap.forEach((containsType, propertyKey) => {
      diceMap.get(this.instance[propertyKey])!.autowire();
    });

    // recursive autowiring of @provides fields
    this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
      diceMap.get(this.instance[propertyKey])!.autowire();
    });

    // resolve @requires field
    this.typeDesc.requiresMap.forEach((diceQuery, propertyKey) => {
      if (this.parent) {
        this.instance[propertyKey] = this.parent.resolveQuery(diceQuery)();
      } else {
        this.instance[propertyKey] = this.container.resolveQuery(diceQuery)();
      }
    });
  }

  resolveQuery(diceQuery: DiceQuery): () => any {
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided)
      return selfProvided;
    else if (this.parent)
      return this.parent.resolveQuery(diceQuery);
    else
      return this.container.resolveQuery(diceQuery);
  }
}
