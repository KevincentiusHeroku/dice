import { ProvidesData } from "../annotations/field-annotation";
import { Dice } from "../container/dice";
export declare const typeDescMap: Map<Type<any>, TypeDesc<any>>;
export declare const typeDescByTag: Map<string, TypeDesc<any>[]>;
export declare const diceMap: WeakMap<any, Dice<any>>;
export declare enum Scope {
    SINGLETON = 0,
    DICE = 1
}
export interface Type<T> {
    new (...args: any[]): T;
}
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
    persistentFields: Set<string>;
}
export declare function createQuery<T>(identifier: Type<T> | any): DiceQuery;
export declare function initializeTypeDescMap(): Map<Type<any>, TypeDesc<any>>;
//# sourceMappingURL=type-desc.d.ts.map