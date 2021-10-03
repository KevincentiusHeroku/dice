import { Scope, Type } from "./type-desc";
export declare function dice<T>(...tags: any[]): (type: Type<T>) => void;
export declare function singleton<T>(...tags: any[]): (type: Type<T>) => void;
export declare function scopeAnnotation<T>(scope: Scope, tags: any[]): (type: Type<T>) => void;
//# sourceMappingURL=scope-annotation.d.ts.map