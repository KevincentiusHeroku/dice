import typeMap, { Scope, Type, TypeDesc } from "./dices";

export class Container {
  get<T>(type: Type<T>): T {
    const typeDesc = typeMap.get(type);
    if (!typeDesc) {
      throw new Error('Type ' + type.name + ' is not found.');
    }

    return this.resolve(typeDesc);
  }

  private resolve<T>(typeDesc: TypeDesc<T>): T {
    if (typeDesc.scope === Scope.SINGLETON) {
      // for singletons, autowire using the global container instead of this, because singletons must have no access to this specific container.
      if (typeDesc.instance == undefined) {
        typeDesc.instance = container.autowire(typeDesc, new typeDesc.type());
      }
      return typeDesc.instance;
    } else if (typeDesc.scope === Scope.PROTOTYPE) {
      return this.autowire(typeDesc, new typeDesc.type());
    } else if (typeDesc.scope === Scope.DICE) {
      // TODO: try to get from own / parent context
      return this.autowire(typeDesc, new typeDesc.type());
    } else {
      throw new Error('Unsupported scope type ' + typeDesc.scope);
    }
  }

  private autowire<T>(typeDesc: TypeDesc<T>, instance: T): T {
    typeDesc.requires.forEach((propertyTypeDesc, propertyKey) => {
      (instance as any)[propertyKey] = this.autowire(propertyTypeDesc, new propertyTypeDesc.type());
    });

    // [typeDesc.provides, typeDesc.requires].forEach(map => map.forEach((propertyTypeDesc, propertyKey) => {
    //   console.debug('autowiring', typeDesc.type.name + '.' + propertyKey);
    //   (instance as any)[propertyKey] = this.resolve(propertyTypeDesc);
    // }));
    return instance;
  }
}

const container = new Container();
export default container;
