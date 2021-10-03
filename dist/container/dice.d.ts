import { Container } from "./container";
import { DiceQuery, TypeDesc } from "../annotations/type-desc";
export declare class Dice<T> {
    private container;
    private parent;
    private typeDesc;
    private instance;
    private provider;
    constructor(container: Container, parent: Dice<any> | null, typeDesc: TypeDesc<T>);
    getContainer(): Container;
    getTypeDesc(): TypeDesc<T>;
    getInstance(): any;
    autowire(): void;
    resolveQuery(diceQuery: DiceQuery): any;
}
//# sourceMappingURL=dice.d.ts.map