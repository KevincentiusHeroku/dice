"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const dice_1 = require("./dice");
const provider_1 = require("./provider");
const type_desc_1 = require("../annotations/type-desc");
class Container {
    provider = new provider_1.Provider();
    constructor() {
        (0, type_desc_1.initializeTypeDescMap)();
        // construct singletons
        type_desc_1.typeDescMap.forEach((typeDesc, type) => {
            if (typeDesc.scope === type_desc_1.Scope.SINGLETON) {
                const dice = new dice_1.Dice(this, null, typeDesc);
                this.provider.register(typeDesc.type, dice.getInstance(), ...typeDesc.tags);
            }
        });
        // autowire singletons
        type_desc_1.typeDescMap.forEach((typeDesc, type) => {
            if (typeDesc.scope === type_desc_1.Scope.SINGLETON) {
                const instance = this.provider.get({ type });
                type_desc_1.diceMap.get(instance).autowire();
            }
        });
    }
    resolve(identifier) {
        return this.resolveQuery((0, type_desc_1.createQuery)(identifier));
    }
    resolveDice(diceQuery, parent) {
        if (diceQuery.type) {
            // get dice by type
            const dice = new dice_1.Dice(this, parent, type_desc_1.typeDescMap.get(diceQuery.type));
            dice.autowire();
            return dice.getInstance();
        }
        else {
            // get dice by tag
            const candidates = type_desc_1.typeDescByTag.get(diceQuery.tag);
            if (candidates.length === 1) {
                const dice = new dice_1.Dice(this, parent, candidates[0]);
                dice.autowire();
                return dice.getInstance();
            }
            else
                throw new Error(`Cannot resolve dice because ${candidates.length} dices were found for tag ${diceQuery.tag}`);
        }
    }
    resolveQuery(diceQuery) {
        const selfProvided = this.provider.getIfExists(diceQuery);
        if (selfProvided)
            // singleton
            return selfProvided;
        else
            return this.resolveDice(diceQuery, null);
        // else if (diceQuery.type) {
        //   // get dice by type
        //   const dice = new Dice(this, null, typeDescMap.get(diceQuery.type)!);
        //   dice.autowire();
        //   return dice.getInstance();
        // } else {
        //   // get dice by tag
        //   const candidates = typeDescByTag.get(diceQuery.tag)!;
        //   if (candidates.length === 1) {
        //     const dice = new Dice(this, null, candidates[0]);
        //     dice.autowire();
        //     return dice.getInstance();
        //   } else
        //     throw new Error(`Cannot resolve dice because ${candidates.length} dices were found for tag ${diceQuery.tag}`);
        // }
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map