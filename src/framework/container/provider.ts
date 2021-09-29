import { DiceQuery, Type } from "./type-desc";

export class Provider {
  instanceByType = new Map<Type<any>, any[]>();
  instanceByTag = new Map<any, any[]>();

  register(type: Type<any>, instance: any, ...tags: any[]) {
    this.registerByType(instance, type);
    this.registerByTags(instance, tags);
  }
  
  private registerByTags(instance: any, tags: any[]) {
    for (const tag of tags) {
      let instances = this.instanceByTag.get(tag);
      if (!instances) {
        instances = [];
        this.instanceByTag.set(tag, instances);
      }
      instances.push(instance);
    }
  }
  
  private registerByType(instance: any, type: Type<any>) {
    let instances = this.instanceByType.get(type);
    if (!instances) {
      instances = [];
      this.instanceByType.set(type, instances);
    }
    instances.push(instance);
  }

  get(diceQuery: DiceQuery): any {
    if (diceQuery.type) {
      return this.getUnique(this.instanceByType.get(diceQuery.type), diceQuery.type);
    } else {
      return this.getUnique(this.instanceByTag.get(diceQuery.tag), diceQuery.tag);
    }
  }

  getIfExists(diceQuery: DiceQuery): any | null {
    if (diceQuery.type) {
      return this.getUniqueIfExists(this.instanceByType.get(diceQuery.type), diceQuery.type);
    } else {
      return this.getUniqueIfExists(this.instanceByTag.get(diceQuery.tag), diceQuery.tag);
    }
  }

  private getUnique(instances: any[] | undefined, identifier: any): any {
    if (!instances || instances.length === 0)
      throw new Error(`No dice with identifier ${identifier} found.`);
    else if (instances.length > 1)
      throw new Error(`Multiple dices (${instances.length}) with identifier ${identifier} found.`)
    else
      return instances[0];
  }

  private getUniqueIfExists(instances: any[] | undefined, identifier: any): any {
    if (!instances || instances.length === 0)
      return null;
    else if (instances.length > 1)
      throw new Error(`Multiple dices (${instances.length}) with identifier ${identifier} found.`)
    else
      return instances[0];
  }
}
