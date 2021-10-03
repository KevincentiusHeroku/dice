import { DiceQuery, Type } from "../annotations/type-desc";
export declare class Container {
    private provider;
    constructor();
    resolve(identifier: Type<any> | any): any;
    resolveDice(diceQuery: DiceQuery, parent?: any): any;
    resolveQuery(diceQuery: DiceQuery): any;
}
//# sourceMappingURL=container.d.ts.map