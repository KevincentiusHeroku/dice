import { Type, createQuery, DiceQuery } from "../container/type-desc";

// global variables from decorators:
export const typeToContainsMap = new Map<Type<any>, Map<string, Type<any>>>();
export const typeToProvidesMap = new Map<Type<any>, Map<string, ProvidesData<any>>>();
export const typeToRequiresMap = new Map<Type<any>, Map<string, DiceQuery>>();
export const typeToPersistentMap = new Map<Type<any>, Map<string, void>>();

export interface ProvidesData<T> {
  type: Type<T>;
  tags: any[];
}

export function contains<T>(containsType: Type<T>) {
  return fieldAnnotation(typeToContainsMap, containsType);
}

export function provides<T>(providesType: Type<T>, ...tags: any) {
  return fieldAnnotation(typeToProvidesMap, {type: providesType, tags});
}

export function requires<T>(identifier: Type<T> | any) {
  return fieldAnnotation(typeToRequiresMap, createQuery(identifier));
}

export function persistent() {
  return fieldAnnotation(typeToPersistentMap, null);
}

function fieldAnnotation<T>(typeToFieldMap: Map<Type<any>, Map<string, T>>, value: T) {
  return function(target: Object, propertyKey: string) {
    let type = target.constructor as Type<T>;

    let fieldMap = typeToFieldMap.get(type);
    if (!fieldMap) {
      fieldMap = new Map();
      typeToFieldMap.set(type, fieldMap);
    }

    fieldMap.set(propertyKey, value);
  }
}