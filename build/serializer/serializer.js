"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const scope_annotation_1 = require("../annotations/scope-annotation");
const type_desc_1 = require("../annotations/type-desc");
let Serializer = class Serializer {
    serialize(instance) {
        const typeDesc = type_desc_1.diceMap.get(instance).getTypeDesc();
        const memento = {};
        [typeDesc.containsMap, typeDesc.providesMap].forEach(compositionMap => {
            for (const propertyKey of compositionMap.keys()) {
                memento[propertyKey] = this.serialize(instance[propertyKey]);
            }
        });
        for (const propertyKey of typeDesc.persistentFields.keys()) {
            memento[propertyKey] = instance[propertyKey];
        }
        if (this.hasSnapshot(instance)) {
            memento.snapshot = instance.snapshot();
        }
        return memento;
    }
    restore(type, memento, parent) {
        const instance = type_desc_1.diceMap.get(this).getContainer().resolveDice((0, type_desc_1.createQuery)(type), type_desc_1.diceMap.get(parent));
        this.recursiveRestore(instance, memento);
        return instance;
    }
    restorePersistentFields(instance, memento) {
        const typeDesc = type_desc_1.diceMap.get(instance).getTypeDesc();
        typeDesc.persistentFields.forEach(propertyKey => {
            instance[propertyKey] = memento[propertyKey];
        });
    }
    recursiveRestore(instance, memento) {
        const typeDesc = type_desc_1.diceMap.get(instance).getTypeDesc();
        // recursively restore @contains and @provides fields
        [typeDesc.containsMap, typeDesc.providesMap].forEach(compositionMap => {
            compositionMap.forEach((val, propertyKey) => {
                this.recursiveRestore(instance[propertyKey], memento[propertyKey]);
            });
        });
        // restore current instance
        this.restorePersistentFields(instance, memento);
        if (memento.snapshot) {
            instance.restore(memento.snapshot);
        }
    }
    hasSnapshot(instance) {
        return instance.snapshot instanceof Function && instance.restore instanceof Function;
    }
};
Serializer = __decorate([
    (0, scope_annotation_1.singleton)()
], Serializer);
exports.Serializer = Serializer;
//# sourceMappingURL=serializer.js.map