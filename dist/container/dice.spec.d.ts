import { DiceTestParent } from "./dice.data.spec";
export declare class DiceTestProvidedByAll {
}
export declare class DiceTestProvidedByChild {
}
export declare class DiceTestProvidedByParent {
}
export declare class DiceTestProvidedByParentOnly {
    providedByAll: DiceTestProvidedByAll;
}
export declare class DiceTestSingleton {
}
export declare class DiceTestGrandchild {
    providedByAll: DiceTestProvidedByAll;
    providedByChild: DiceTestProvidedByChild;
    providedByParent: DiceTestProvidedByParent;
    providedByParentOnly: DiceTestProvidedByParentOnly;
    singleton: DiceTestSingleton;
}
export declare class DiceTestChild {
    providedByAll: DiceTestProvidedByAll;
    providedByChild: DiceTestProvidedByChild;
    providedByParent: DiceTestProvidedByParent;
    providedByParentOnly: DiceTestProvidedByParentOnly;
    singleton: DiceTestSingleton;
    grandChild: DiceTestGrandchild;
    parent: DiceTestParent;
}
//# sourceMappingURL=dice.spec.d.ts.map