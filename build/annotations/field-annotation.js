"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistent = exports.requires = exports.provides = exports.contains = exports.typeToPersistentMap = exports.typeToRequiresMap = exports.typeToProvidesMap = exports.typeToContainsMap = void 0;
const type_desc_1 = require("../annotations/type-desc");
// global variables from decorators:
exports.typeToContainsMap = new Map();
exports.typeToProvidesMap = new Map();
exports.typeToRequiresMap = new Map();
exports.typeToPersistentMap = new Map();
function contains(containsType) {
    return fieldAnnotation(exports.typeToContainsMap, containsType);
}
exports.contains = contains;
function provides(providesType, ...tags) {
    return fieldAnnotation(exports.typeToProvidesMap, { type: providesType, tags });
}
exports.provides = provides;
function requires(identifier) {
    return fieldAnnotation(exports.typeToRequiresMap, (0, type_desc_1.createQuery)(identifier));
}
exports.requires = requires;
function persistent() {
    return fieldAnnotation(exports.typeToPersistentMap, null);
}
exports.persistent = persistent;
function fieldAnnotation(typeToFieldMap, value) {
    return function (target, propertyKey) {
        let type = target.constructor;
        let fieldMap = typeToFieldMap.get(type);
        if (!fieldMap) {
            fieldMap = new Map();
            typeToFieldMap.set(type, fieldMap);
        }
        fieldMap.set(propertyKey, value);
    };
}
//# sourceMappingURL=field-annotation.js.map