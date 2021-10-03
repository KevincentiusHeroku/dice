"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTypeDescMap = exports.createQuery = exports.Scope = exports.diceMap = exports.typeDescByTag = exports.typeDescMap = void 0;
const field_annotation_1 = require("../annotations/field-annotation");
// global variables from decorators:
exports.typeDescMap = new Map();
exports.typeDescByTag = new Map();
// global variables for main phase:
exports.diceMap = new WeakMap();
// ---------------------------------
var Scope;
(function (Scope) {
    Scope[Scope["SINGLETON"] = 0] = "SINGLETON";
    Scope[Scope["DICE"] = 1] = "DICE";
})(Scope = exports.Scope || (exports.Scope = {}));
function createQuery(identifier) {
    return {
        type: typeof identifier === 'function' ? identifier : undefined,
        tag: typeof identifier === 'function' ? undefined : identifier,
    };
}
exports.createQuery = createQuery;
let typeDescMapInitialized = false;
function initializeTypeDescMap() {
    if (!typeDescMapInitialized) {
        exports.typeDescMap.forEach((typeDesc, type) => {
            // put entries of typeToContainsMap into typeDescMap
            typeDesc.containsMap = field_annotation_1.typeToContainsMap.get(type) ?? new Map();
            // put entries of typeToProvidesMap into typeDescMap
            typeDesc.providesMap = field_annotation_1.typeToProvidesMap.get(type) ?? new Map();
            // put entries of typeToRequiresMap into typeDescMap
            typeDesc.requiresMap = field_annotation_1.typeToRequiresMap.get(type) ?? new Map();
            // put entries of typeToPersistentMap into typeDescMap
            typeDesc.persistentFields = new Set(field_annotation_1.typeToPersistentMap.get(type)?.keys());
        });
        typeDescMapInitialized = true;
    }
    return exports.typeDescMap;
}
exports.initializeTypeDescMap = initializeTypeDescMap;
//# sourceMappingURL=type-desc.js.map