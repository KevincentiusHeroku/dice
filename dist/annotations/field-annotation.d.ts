import { Type, DiceQuery } from "../annotations/type-desc";
export declare const typeToContainsMap: Map<Type<any>, Map<string, Type<any>>>;
export declare const typeToProvidesMap: Map<Type<any>, Map<string, ProvidesData<any>>>;
export declare const typeToRequiresMap: Map<Type<any>, Map<string, DiceQuery>>;
export declare const typeToPersistentMap: Map<Type<any>, Map<string, void>>;
export interface ProvidesData<T> {
    type: Type<T>;
    tags: any[];
}
export declare function contains<T>(containsType: Type<T>): (target: Object, propertyKey: string) => void;
export declare function provides<T>(providesType: Type<T>, ...tags: any): (target: Object, propertyKey: string) => void;
export declare function requires<T>(identifier: Type<T> | any): (target: Object, propertyKey: string) => void;
export declare function persistent(): (target: Object, propertyKey: string) => void;
//# sourceMappingURL=field-annotation.d.ts.map