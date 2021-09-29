// import { DiceQueryMode, Type } from "../container/type-desc";

// export function ctorProvides<T>(query: Type<T> | any) {
//   return fieldAnnotation(DiceQueryMode.PROVIDES, query);
// }

// export function ctorRequires<T>(query: Type<T> | any) {
//   return fieldAnnotation(DiceQueryMode.REQUIRES, query);
// }

// function fieldAnnotation<T>(queryMode: DiceQueryMode, query: Type<T> | any) {
//   /**
//    * The propertyKey is not yet supported by Typescript (it is always undefined, even though it is there!)
//    *    Source: https://github.com/microsoft/TypeScript/issues/15904
//    * 
//    * Until then, use the parameter index instead.
//    */
//   return function(target: Object, propertyKey: string | symbol, paramenterIndex: number) {
//     let type = target as Type<T>;

//     let providesMap = typeCtorParamMap.get(type);
//     if (!providesMap) {
//       providesMap = [];
//       typeCtorParamMap.set(type, providesMap);
//     }

//     providesMap[paramenterIndex] = createQuery(queryMode, query);
//   };
// }
