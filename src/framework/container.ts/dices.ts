
export enum Scope { SINGLETON, PROTOTYPE, DICE }
export interface Type<T> { new(): T; }

export interface TypeDesc<T> {
  type: Type<T>;
  scope: Scope;
  instance?: T;

  provides: Map<string, TypeDesc<T>>;
  requires: Map<string, TypeDesc<T>>;
}

const typeMap = new Map<any, TypeDesc<any>>();
export default typeMap;

export function singleton<T>(): (type: Type<T>) => void {
  return function(type: Type<T>) {
    if (typeMap.get(type) != null) {
      throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
    }

    typeMap.set(type, {
      type: type,
      scope: Scope.SINGLETON,

      provides: new Map(),
      requires: new Map(),
    });

    console.debug('Registered singleton ' + type.name);
  }
}

export function prototype<T>(): (type: Type<T>) => void {
  return function(type: Type<T>) {
    if (typeMap.get(type) != null) {
      throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
    }

    typeMap.set(type, {
      type: type,
      scope: Scope.PROTOTYPE,

      provides: new Map(),
      requires: new Map(),
    });

    console.debug('Registered prototype ' + type.name);
  }
}

export function dice<T>(): (type: Type<T>) => void {
  return function(type: Type<T>) {
    if (typeMap.get(type) != null) {
      throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
    }

    typeMap.set(type, {
      type: type,
      scope: Scope.DICE,

      provides: new Map(),
      requires: new Map(),
    });

    console.debug('Registered dice ' + type.name);
  }
}

export function provides<T>(type: Type<T>): (target: Object, propertyKey: string) => void {
  return function(target: Object, propertyKey: string) {
    const typeDesc = typeMap.get(target.constructor)!;
    if (typeDesc == null) {
      console.log(JSON.stringify(typeMap));
      throw new Error('The type ' + target.constructor.name + ' is using @provides annotation for its properties, but the class itself is not annotated as a component!');
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
    const typeDesc = typeMap.get(target.constructor)!;
    if (typeDesc == null) {
      throw new Error('The type ' + target.constructor.name + ' is using @requires annotation for its properties, but the class itself is not annotated as a component!');
    }

    const propertyTypeDesc = typeMap.get(type);
    if (propertyTypeDesc == null) {
      throw new Error('The type ' + type.name + ' is not found! The class must be annotated as a component.');
    }

    typeDesc.requires.set(propertyKey, propertyTypeDesc);
  };
}
