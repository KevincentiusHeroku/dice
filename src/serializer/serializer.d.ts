import { Type } from "../annotations/type-desc";
export interface Serializable {
    snapshot?(): any;
    restore?(): any;
}
export declare class Serializer {
    serialize(instance: any): any;
    restore<T>(type: Type<T>, memento: any, parent?: any): any;
    private restorePersistentFields;
    private recursiveRestore;
    private hasSnapshot;
}
//# sourceMappingURL=serializer.d.ts.map