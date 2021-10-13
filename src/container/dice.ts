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
      let providesTags = providesData.tags;
      if (providesData.type) {
        const providesTypeDesc = typeDescMap.get(providesData.type)!;
        providesTags = Array.from(new Set(providesTags.concat(providesTypeDesc.tags)));
        
        let childDice = new Dice(this.container, this, providesTypeDesc);
        this.instance[propertyKey] = childDice.instance;
      }

      this.provider.register(providesData.type, () => this.instance[propertyKey], ...providesTags);
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
      if (providesData.type) {
        diceMap.get(this.instance[propertyKey])!.autowire();
      }
    });

    // resolve @requires fields
    this.typeDesc.requiresMap.forEach((diceQuery, propertyKey) => {
      this.instance[propertyKey] = this.resolveGetterInParent(diceQuery)();
    });

    // resolve @requires getter fields
    this.typeDesc.requiresGetterMap.forEach((diceQuery, propertyKey) => {
      console.log(JSON.stringify(diceQuery), propertyKey);
      this.instance[propertyKey] = this.resolveGetterInParent(diceQuery);
    })
  }

  private resolveGetterInParent(diceQuery: DiceQuery): () => any {
    if (this.parent) {
      return this.parent.resolveGetterQuery(diceQuery);
    } else {
      return this.container.resolveGetterQuery(diceQuery);
    }
  }

  resolveGetterQuery(diceQuery: DiceQuery): () => any {
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided)
      return selfProvided;
    else if (this.parent)
      return this.parent.resolveGetterQuery(diceQuery);
    else
      return this.container.resolveGetterQuery(diceQuery);
  }
}
