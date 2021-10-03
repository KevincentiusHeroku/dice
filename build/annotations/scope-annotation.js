"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeAnnotation = exports.singleton = exports.dice = void 0;
const type_desc_1 = require("./type-desc");
function dice(...tags) {
    return scopeAnnotation(type_desc_1.Scope.DICE, tags);
}
exports.dice = dice;
function singleton(...tags) {
    return scopeAnnotation(type_desc_1.Scope.SINGLETON, tags);
}
exports.singleton = singleton;
function scopeAnnotation(scope, tags) {
    return function (type) {
        const td = {
            type: type,
            scope: scope,
            tags: tags,
            containsMap: null,
            providesMap: null,
            requiresMap: null,
            persistentFields: null,
        };
        const typeDesc = type_desc_1.typeDescMap.get(type);
        if (typeDesc == null) {
            type_desc_1.typeDescMap.set(type, td);
            tags.forEach(tag => {
                let typeDescs = type_desc_1.typeDescByTag.get(tag);
                if (!typeDescs) {
                    typeDescs = [];
                    type_desc_1.typeDescByTag.set(tag, typeDescs);
                }
                typeDescs.push(td);
            });
        }
        else {
            throw new Error('The type ' + type.name + ' is being registered multiple times in the current container!');
        }
    };
}
exports.scopeAnnotation = scopeAnnotation;
//# sourceMappingURL=scope-annotation.js.map