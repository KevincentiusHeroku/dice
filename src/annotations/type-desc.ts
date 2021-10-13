import { ProvidesData, typeToContainsMap, typeToPersistentMap, typeToProvidesMap, typeToRequiresGetterMap, typeToRequiresMap } from "../annotations/field-annotation";
import { Dice } from "../container/dice";

// global variables from decorators:
export const typeDescMap = new Map<Type<any>, TypeDesc<any>>();
export const typeDescByTag = new Map<string, TypeDesc<any>[]>();
// global variables for main phase:
export const diceMap = new WeakMap<any, Dice<any>>();
// ---------------------------------

export enum Scope { SINGLETON, DICE }
export interface Type<T> { new(...args: any[]): T; }

export interface DiceQuery {
  type?: Type<any>;
  tag?: any;
}

export interface TypeDesc<T> {
  type: Type<T>;
  scope: Scope;
  tags: any[];

  containsMap: Map<string, Type<any>>;
  providesMap: Map<string, ProvidesData<any>>;
  requiresMap: Map<string, DiceQuery>;
  requiresGetterMap: Map<string, DiceQuery>;
  persistentFields: Set<string>;
}

export function createQuery<T>(identifier: Type<T> | any): DiceQuery {
  if (identifier===undefined) {
    throw new Error('undefined identifier');
  }
  return {
    type: typeof identifier === 'function' ? identifier : undefined,
    tag: typeof identifier === 'function' ? undefined : identifier,
  };
}

let typeDescMapInitialized = false;
export function initializeTypeDescMap() {
  if (!typeDescMapInitialized) {
    typeDescMap.forEach((typeDesc, type) => {
      // put entries of typeToContainsMap into typeDescMap
      typeDesc.containsMap = typeToContainsMap.get(type) ?? new Map();

      // put entries of typeToProvidesMap into typeDescMap
      typeDesc.providesMap = typeToProvidesMap.get(type) ?? new Map();

      // put entries of typeToRequiresMap into typeDescMap
      typeDesc.requiresMap = typeToRequiresMap.get(type) ?? new Map();
      console.log('req', JSON.stringify(typeToRequiresMap.get(type)), typeDesc.type.name);

      // put entries of typeToRequiresGetterMap into typeDescMap
      typeDesc.requiresGetterMap = typeToRequiresGetterMap.get(type) ?? new Map();

      // put entries of typeToPersistentMap into typeDescMap
      typeDesc.persistentFields = new Set<string>(typeToPersistentMap.get(type)?.keys());
    });
    typeDescMapInitialized = true;
  }
  return typeDescMap;
}
