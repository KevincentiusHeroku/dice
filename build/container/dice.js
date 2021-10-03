"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dice = void 0;
const provider_1 = require("./provider");
const type_desc_1 = require("../annotations/type-desc");
class Dice {
    container;
    parent;
    typeDesc;
    instance;
    provider = new provider_1.Provider();
    constructor(container, parent, typeDesc) {
        this.container = container;
        this.parent = parent;
        this.typeDesc = typeDesc;
        this.instance = new typeDesc.type();
        type_desc_1.diceMap.set(this.instance, this);
        this.provider.register(this.typeDesc.type, this.instance, this.typeDesc.tags);
        // preconstruct provided dices
        this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
            const providesTypeDesc = type_desc_1.typeDescMap.get(providesData.type);
            let childDice = new Dice(this.container, this, providesTypeDesc);
            this.instance[propertyKey] = childDice.instance;
            this.provider.register(providesTypeDesc.type, childDice.instance, ...new Set(providesTypeDesc.tags.concat(providesData.tags)));
        });
        // preconstruct contained dices
        this.typeDesc.containsMap.forEach((containsType, propertyKey) => {
            const containsTypeDesc = type_desc_1.typeDescMap.get(containsType);
            let childDice = new Dice(this.container, this, containsTypeDesc);
            this.instance[propertyKey] = childDice.instance;
        });
    }
    getContainer() { return this.container; }
    getTypeDesc() { return this.typeDesc; }
    getInstance() { return this.instance; }
    autowire() {
        // recursive autowiring of @contains fields
        this.typeDesc.containsMap.forEach((containsType, propertyKey) => {
            type_desc_1.diceMap.get(this.instance[propertyKey]).autowire();
        });
        // recursive autowiring of @provides fields
        this.typeDesc.providesMap.forEach((providesData, propertyKey) => {
            type_desc_1.diceMap.get(this.instance[propertyKey]).autowire();
        });
        // resolve @requires field
        this.typeDesc.requiresMap.forEach((diceQuery, propertyKey) => {
            if (this.parent) {
                this.instance[propertyKey] = this.parent.resolveQuery(diceQuery);
            }
            else {
                this.instance[propertyKey] = this.container.resolveQuery(diceQuery);
            }
        });
    }
    resolveQuery(diceQuery) {
        const selfProvided = this.provider.getIfExists(diceQuery);
        if (selfProvided)
            return selfProvided;
        else if (this.parent)
            return this.parent.resolveQuery(diceQuery);
        else
            return this.container.resolveQuery(diceQuery);
    }
}
exports.Dice = Dice;
//# sourceMappingURL=dice.js.map