import { ContainerImpl } from "./container";
import { Provider } from "./provider";
import { createQuery, diceMap, DiceQuery, Type, TypeDesc, typeDescMap } from "../annotations/type-desc";

export class Dice<T> {
  private instance: any;
  private provider: Provider = new Provider();
  private isMock = false;
  
  constructor(
    private container: ContainerImpl,
    private parent: Dice<any> | null,
    private typeDesc: TypeDesc<T>,
    private replacement?: (() => any) | null
  ) {
    if (this.replacement) {
      this.instance = this.replacement();
      this.isMock = true;
      diceMap.set(this.instance, this);
    } else {
      this.instance = new typeDesc.type();
      diceMap.set(this.instance, this);
      
      this.provider.register(this.typeDesc.type, () => this.instance, ...this.typeDesc.tags);

      // preconstruct provided dices
      this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
        let providesTags = providesData.tags;
        if (providesData.type) {
          const providesTypeDesc = this.createChildDice(providesData.type, propertyKey);
          
          providesTags = Array.from(new Set(providesTags.concat(providesTypeDesc.tags)));
        }

        this.provider.register(providesData.type, () => this.instance[propertyKey], ...providesTags);
      });

      // preconstruct contained dices
      this.typeDesc.containsMap.forEach((containsType, propertyKey) => {
        this.createChildDice(containsType, propertyKey);
      });
    }
  }

  private createChildDice(type: Type<any>, propertyKey: string) {
    const typeDesc = typeDescMap.get(type)!;
    const replacement = this.container.getReplacement(createQuery(type));

    const childDice = new Dice(this.container, this, typeDesc, replacement);

    this.instance[propertyKey] = childDice.instance;
    return typeDesc;
  }

  getContainer() { return this.container; }
  getTypeDesc() { return this.typeDesc; }
  getInstance() { return this.instance; }
  
  autowire() {
    if (this.isMock) {
      return;
    }

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
    // replacements (mocks)
    const replacement = this.container.getReplacement(diceQuery);
    if (replacement) {
      return replacement;
    }

    // self provided
    const selfProvided = this.provider.getIfExists(diceQuery);
    if (selfProvided) {
      return selfProvided;
    }

    // delegate (bubble) to parent / container
    if (this.parent) {
      return this.parent.resolveGetterQuery(diceQuery);
    } else {
      return this.container.resolveGetterQuery(diceQuery);
    }
  }
}
