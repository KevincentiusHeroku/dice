import { Type, createQuery, DiceQuery } from "../container/type-desc";

// global variables from decorators:
export const typeToProvidesMap = new Map<Type<any>, Map<string, ProvidesData<any>>>();
export const typeToRequiresMap = new Map<Type<any>, Map<string, DiceQuery>>();

export interface ProvidesData<T> {
  type: Type<T>;
  tags: any[];
}

export function provides<T>(providesType: Type<T>, ...tags: any) {
  return function(target: Object, propertyKey: string) {
    let type = target.constructor as Type<T>;

    let providesMap = typeToProvidesMap.get(type);
    if (!providesMap) {
      providesMap = new Map();
      typeToProvidesMap.set(type, providesMap);
    }

    providesMap.set(propertyKey, {type: providesType, tags});
  };
}

export function requires<T>(identifier: Type<T> | any) {
  return function(target: Object, propertyKey: string) {
    let type = target.constructor as Type<T>;

    let requiresMap = typeToRequiresMap.get(type);
    if (!requiresMap) {
      requiresMap = new Map();
      typeToRequiresMap.set(type, requiresMap);
    }

    requiresMap.set(propertyKey, createQuery(identifier));
  };
}
