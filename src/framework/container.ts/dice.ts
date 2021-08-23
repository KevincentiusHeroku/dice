import typeMap, { Scope, singleton, Type, TypeDesc } from "./annotation";

interface Container {
  get<T>(type: Type<T>): T;
}
class Root implements Container {
  diceMap = new WeakMap<any, Dice<any>>();
  singletonMap = new Map<Type<any>, any>();  
  
  private initialized = false;

  get<T>(type: Type<T>): T {
    if (!this.initialized)
      this.initSingletons();
    
    const typeDesc = typeMap.get(type);
    if (!typeDesc)
      throw new Error('Type ' + type.name + ' is not found. Is the class missing a @dice() annotation?');
    else if (typeDesc.scope == Scope.SINGLETON)
      return this.singletonMap.get(typeDesc.type);
    else {
      // create new dice every time
      const childDice = new Dice(typeDesc, null);
      container.diceMap.set(childDice.instance, childDice);
      childDice.autowire();
      return childDice.instance;
    }
  }

  private initSingletons() {
    const singletonDices: Dice<any>[] = [];
    typeMap.forEach((typeDesc, type) => {
      if (typeDesc.scope == Scope.SINGLETON) {
        const dice = new Dice(typeDesc, null);
        this.singletonMap.set(type, dice.instance);
        singletonDices.push(dice);
        console.debug("initialized singleton " + type.name);
      }
    });
    singletonDices.forEach(dice => dice.autowire());
  }
}
const container = new Root();
export default container as Container;

export class Dice<I> {
  private provides = new Map<Type<any>, any>();
  public instance!: I;

  constructor(
    private typeDesc: TypeDesc<I>,
    private parent: Dice<I> | null,
  ) {
    this.instance = new typeDesc.type();
  }

  resolve<T>(type: Type<T>): T {
    const typeDesc = typeMap.get(type);
    if (!typeDesc)
      throw new Error('Type ' + type.name + ' is not found. Is the class missing a @dice() annotation?');
    else if (typeDesc.scope == Scope.SINGLETON)
      return container.singletonMap.get(typeDesc.type);
    else {
      const prov = this.provides.get(typeDesc.type);
      if (prov != null) {
        // resolve on our own
        console.debug(typeDesc.type.name + ' is found in ' + this.typeDesc.type.name + '.');
        return prov;
      } else if (this.parent != null) {
        // cannot resolve on our own, let the parent resolve it
        console.debug(typeDesc.type.name + ' is not found in ' + this.typeDesc.type.name +'. Passing to parent...');
        return this.parent.resolve(type);
      } else
        // reached the root and still unresolved
        throw new Error('Could not resolve ' + typeDesc.type.name + ' in ' + this.typeDesc.type.name + '. Is the instance not a @singleton() and yet is not being provided (@provides) by any parent object?');
    }
  }

  autowire() {
    const i = this.instance as any;
    // create and autowire @provides dependencies
    const childDices: Dice<any>[] = [];
    this.typeDesc.provides.forEach((typeDesc, prop) => {
      console.debug(this.typeDesc.type.name + ' provides ' + typeDesc.type.name);
      const childDice = new Dice(typeDesc, this);
      i[prop] = childDice.instance;
      container.diceMap.set(childDice.instance, childDice);
      childDices.push(childDice);
      this.provides.set(typeDesc.type, childDice.instance);
    });
    childDices.forEach(childDice => childDice.autowire());

    // resolve @requires dependencies
    this.typeDesc.requires.forEach((typeDesc, prop) => {
      console.debug(this.typeDesc.type.name + ' requires ' + typeDesc.type.name);
      i[prop] = this.resolve(typeDesc.type);
    });
  }
}
