import { DiceQuery, Type } from "../annotations/type-desc";
export declare class Provider {
    instanceByType: Map<Type<any>, any[]>;
    instanceByTag: Map<any, any[]>;
    register(type: Type<any>, instance: any, ...tags: any[]): void;
    private registerByTags;
    private registerByType;
    get(diceQuery: DiceQuery): any;
    getIfExists(diceQuery: DiceQuery): any | null;
    private getUnique;
    private getUniqueIfExists;
}
//# sourceMappingURL=provider.d.ts.map