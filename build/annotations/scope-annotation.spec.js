"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_desc_1 = require("./type-desc");
const scope_annotation_1 = require("./scope-annotation");
let TestDice = class TestDice {
    testVal = '123';
};
TestDice = __decorate([
    (0, scope_annotation_1.dice)('tag1', 'tag2')
], TestDice);
let TestSingleton = class TestSingleton {
    testVal = '123';
};
TestSingleton = __decorate([
    (0, scope_annotation_1.singleton)('tag2', 'tag3')
], TestSingleton);
describe('Dice annotation', () => {
    it('should register dice types', () => {
        let typeDesc = type_desc_1.typeDescMap.get(TestDice);
        expect(typeDesc?.scope).toBe(type_desc_1.Scope.DICE);
        expect(typeDesc?.type).toBe(TestDice);
        expect(typeDesc?.tags[0]).toBe('tag1');
        expect(typeDesc?.tags[1]).toBe('tag2');
    });
    it('should register singleton types', () => {
        let typeDesc = type_desc_1.typeDescMap.get(TestSingleton);
        expect(typeDesc?.scope).toBe(type_desc_1.Scope.SINGLETON);
        expect(typeDesc?.type).toBe(TestSingleton);
        expect(typeDesc?.tags[0]).toBe('tag2');
        expect(typeDesc?.tags[1]).toBe('tag3');
    });
    it('should report an error if a singleton type is registered multiple times', () => {
        expect(() => (0, scope_annotation_1.singleton)()(TestSingleton)).toThrow();
    });
    it('should report an error if a dice type is registered multiple times', () => {
        expect(() => (0, scope_annotation_1.dice)()(TestDice)).toThrow();
    });
});
//# sourceMappingURL=scope-annotation.spec.js.map