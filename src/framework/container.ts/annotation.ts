
export enum Scope { SINGLETON, DICE }
export interface Type<T> { new(): T; }

export interface TypeDesc<T> {
  type: Type<T>;
  scope?: Scope;
  instance?: T;

  provides: Map<string, TypeDesc<T>>;
  requires: Map<string, TypeDesc<T>>;
}

const typeMap = new Map<any, TypeDesc<any>>();
export default typeMap;

export function singleton<T>(): (type: Type<T>) => void {
  return function(type: Type<T>) {
    const typeDesc = typeMap.get(type);
    if (typeDesc == null) {
      typeMap.set(type, {
        type: type,
        scope: Scope.SINGLETON,
  
        provides: new Map(),
        requires: new Map(),
      });
    } else if (typeDesc.scope === undefined) {
      typeDesc.scope = Scope.SINGLETON;
    } else {
      throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
    }
    console.debug('Registered singleton ' + type.name);
  }
}

export function dice<T>(): (type: Type<T>) => void {
  return function(type: Type<T>) {
    const typeDesc = typeMap.get(type);
    if (typeDesc == null) {
      typeMap.set(type, {
        type: type,
        scope: Scope.DICE,
  
        provides: new Map(),
        requires: new Map(),
      });
    } else if (typeDesc.scope === undefined) {
      typeDesc.scope = Scope.DICE;
    } else {
      throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
    }
    console.debug('Registered dice ' + type.name);
  }
}

export function provides<T>(type: Type<T>): (target: Object, propertyKey: string) => void {
  return function(target: Object, propertyKey: string) {
    let typeDesc = typeMap.get(target.constructor)!;
    if (typeDesc == null) {
      typeDesc = {
        type: target.constructor as Type<T>,
        provides: new Map(),
        requires: new Map(),
      };
      typeMap.set(target.constructor, typeDesc);
      console.debug('pre-registered ' + target.constructor.name);
    }

    const propertyTypeDesc = typeMap.get(type);
    if (propertyTypeDesc == null) {
      throw new Error('The type ' + type.name + ' is not found! The class must be annotated as a component.');
    }

    typeDesc.provides.set(propertyKey, propertyTypeDesc);
  };
}

export function requires<T>(type: Type<T>): (target: Object, propertyKey: string) => void {
  return function(target: Object, propertyKey: string) {
    let typeDesc = typeMap.get(target.constructor)!;
    if (typeDesc == null) {
      typeDesc = {
        type: target.constructor as Type<T>,
        provides: new Map(),
        requires: new Map(),
      };
      typeMap.set(target.constructor, typeDesc);
      console.debug('pre-registered ' + target.constructor.name);
    }

    const propertyTypeDesc = typeMap.get(type);
    if (propertyTypeDesc == null) {
      throw new Error('The type ' + type.name + ' is not found! The class must be annotated as a component.');
    }

    typeDesc.requires.set(propertyKey, propertyTypeDesc);
  };
}
