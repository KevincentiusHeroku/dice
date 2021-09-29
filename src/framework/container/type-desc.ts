import { ProvidesData, typeToProvidesMap, typeToRequiresMap } from "../annotations/field-annotation";
import { Dice } from "./dice";

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

  providesMap: Map<string, ProvidesData<any>>;
  requiresMap: Map<string, DiceQuery>;
}

export function createQuery<T>(identifier: Type<T> | any): DiceQuery {
  return {
    type: typeof identifier === 'function' ? identifier : undefined,
    tag: typeof identifier === 'function' ? undefined : identifier,
  };
}

let typeDescMapInitialized = false;
export function initializeTypeDescMap() {
  if (!typeDescMapInitialized) {
    typeDescMap.forEach((typeDesc, type) => {
      // put entries of typeToProvidesMap into typeDescMap
      typeDesc.providesMap = typeToProvidesMap.get(type) ?? new Map();

      // put entries of typeToRequiresMap into typeDescMap
      typeDesc.requiresMap = typeToRequiresMap.get(type) ?? new Map();
    });
    typeDescMapInitialized = true;
  }
  return typeDescMap;
}
