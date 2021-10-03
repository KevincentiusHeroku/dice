"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
class Provider {
    instanceByType = new Map();
    instanceByTag = new Map();
    register(type, instance, ...tags) {
        this.registerByType(instance, type);
        this.registerByTags(instance, tags);
    }
    registerByTags(instance, tags) {
        for (const tag of tags) {
            let instances = this.instanceByTag.get(tag);
            if (!instances) {
                instances = [];
                this.instanceByTag.set(tag, instances);
            }
            instances.push(instance);
        }
    }
    registerByType(instance, type) {
        let instances = this.instanceByType.get(type);
        if (!instances) {
            instances = [];
            this.instanceByType.set(type, instances);
        }
        instances.push(instance);
    }
    get(diceQuery) {
        if (diceQuery.type) {
            return this.getUnique(this.instanceByType.get(diceQuery.type), diceQuery.type);
        }
        else {
            return this.getUnique(this.instanceByTag.get(diceQuery.tag), diceQuery.tag);
        }
    }
    getIfExists(diceQuery) {
        if (diceQuery.type) {
            return this.getUniqueIfExists(this.instanceByType.get(diceQuery.type), diceQuery.type);
        }
        else {
            return this.getUniqueIfExists(this.instanceByTag.get(diceQuery.tag), diceQuery.tag);
        }
    }
    getUnique(instances, identifier) {
        if (!instances || instances.length === 0)
            throw new Error(`No dice with identifier ${identifier} found.`);
        else if (instances.length > 1)
            throw new Error(`Multiple dices (${instances.length}) with identifier ${identifier} found.`);
        else
            return instances[0];
    }
    getUniqueIfExists(instances, identifier) {
        if (!instances || instances.length === 0)
            return null;
        else if (instances.length > 1)
            throw new Error(`Multiple dices (${instances.length}) with identifier ${identifier} found.`);
        else
            return instances[0];
    }
}
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map