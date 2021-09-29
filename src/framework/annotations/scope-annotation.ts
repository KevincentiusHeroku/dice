import { Scope, Type, TypeDesc, typeDescByTag, typeDescMap } from "../container/type-desc";

export function dice<T>(...tags: any[]) {
  return scopeAnnotation<T>(Scope.DICE, tags);
}

export function singleton<T>(...tags: any[]) {
  return scopeAnnotation<T>(Scope.SINGLETON, tags);
}

export function scopeAnnotation<T>(scope: Scope, tags: any[]) {
  return function(type: Type<T>) {
    const td: TypeDesc<T> = {
      type: type,
      scope: scope,
      tags: tags,

      providesMap: null!,
      requiresMap: null!,
    };

    const typeDesc = typeDescMap.get(type);
    if (typeDesc == null) {
      typeDescMap.set(type, td);
      tags.forEach(tag => {
        let typeDescs = typeDescByTag.get(tag);
        if (!typeDescs) {
          typeDescs = [];
          typeDescByTag.set(tag, typeDescs);
        }
        typeDescs.push(td);
      });
    } else {
      throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
    }
  }
}