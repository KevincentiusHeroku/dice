import { DiceQuery, Type } from "../annotations/type-desc";

export class Provider {
  getterByType = new Map<Type<any>, (() => any)[]>();
  getterByTag = new Map<any, (() => any)[]>();

  register(type: Type<any>, getter: (() => any), ...tags: any[]) {
    this.registerByType(getter, type);
    this.registerByTags(getter, tags);
  }
  
  private registerByTags(getter: (() => any), tags: any[]) {
    for (const tag of tags) {
      let getters = this.getterByTag.get(tag);
      if (!getters) {
        getters = [];
        this.getterByTag.set(tag, getters);
      }
      getters.push(getter);
    }
  }
  
  private registerByType(getter: (() => any), type: Type<any>) {
    let getters = this.getterByType.get(type);
    if (!getters) {
      getters = [];
      this.getterByType.set(type, getters);
    }
    getters.push(getter);
  }

  get(diceQuery: DiceQuery): () => any {
    if (diceQuery.type) {
      return this.getUnique(this.getterByType.get(diceQuery.type), diceQuery.type);
    } else {
      return this.getUnique(this.getterByTag.get(diceQuery.tag), diceQuery.tag);
    }
  }

  getIfExists(diceQuery: DiceQuery): (() => any) | null {
    if (diceQuery.type) {
      return this.getUniqueIfExists(this.getterByType.get(diceQuery.type), diceQuery.type);
    } else {
      return this.getUniqueIfExists(this.getterByTag.get(diceQuery.tag), diceQuery.tag);
    }
  }

  private getUnique(getters: (() => any)[] | undefined, identifier: any): any {
    if (!getters || getters.length === 0)
      throw new Error(`No dice with identifier ${identifier} found.`);
    else if (getters.length > 1)
      throw new Error(`Multiple dices (${getters.length}) with identifier ${identifier} found.`)
    else
      return getters[0];
  }

  private getUniqueIfExists(getters: (() => any)[] | undefined, identifier: any): any {
    if (!getters || getters.length === 0)
      return null;
    else if (getters.length > 1)
      throw new Error(`Multiple dices (${getters.length}) with identifier ${identifier} found.`)
    else
      return getters[0];
  }
}
