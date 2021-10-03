"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const field_annotation_1 = require("./field-annotation");
const scope_annotation_1 = require("./scope-annotation");
const type_desc_1 = require("./type-desc");
let TestDiceGrandchild = class TestDiceGrandchild {
};
TestDiceGrandchild = __decorate([
    (0, scope_annotation_1.dice)('tag-grandchild')
], TestDiceGrandchild);
let TestDiceChild = class TestDiceChild {
    grandchild;
};
__decorate([
    (0, field_annotation_1.provides)(TestDiceGrandchild),
    __metadata("design:type", TestDiceGrandchild)
], TestDiceChild.prototype, "grandchild", void 0);
TestDiceChild = __decorate([
    (0, scope_annotation_1.dice)('tag-child')
], TestDiceChild);
let TestDiceContained = class TestDiceContained {
};
TestDiceContained = __decorate([
    (0, scope_annotation_1.dice)('tag-contained')
], TestDiceContained);
let TestDiceEmpty = class TestDiceEmpty {
};
TestDiceEmpty = __decorate([
    (0, scope_annotation_1.dice)()
], TestDiceEmpty);
let TestCandy = class TestCandy {
};
TestCandy = __decorate([
    (0, scope_annotation_1.singleton)('tag-candy')
], TestCandy);
let TestSingleton = class TestSingleton {
    contained;
    child;
    candy;
    myVal = 5;
    myObj = { arr: [1, 2, 3], map: new Map() };
};
__decorate([
    (0, field_annotation_1.contains)(TestDiceContained),
    __metadata("design:type", TestDiceContained)
], TestSingleton.prototype, "contained", void 0);
__decorate([
    (0, field_annotation_1.provides)(TestDiceChild),
    __metadata("design:type", TestDiceChild)
], TestSingleton.prototype, "child", void 0);
__decorate([
    (0, field_annotation_1.requires)(TestCandy),
    __metadata("design:type", TestCandy)
], TestSingleton.prototype, "candy", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestSingleton.prototype, "myVal", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestSingleton.prototype, "myObj", void 0);
TestSingleton = __decorate([
    (0, scope_annotation_1.singleton)('tag-singleton')
], TestSingleton);
describe('Dice annotation', () => {
    it('should register dice types', () => {
        (0, type_desc_1.initializeTypeDescMap)();
        expect(type_desc_1.typeDescMap.get(TestSingleton)?.containsMap.get('contained')).toBe(TestDiceContained);
        expect(type_desc_1.typeDescMap.get(TestSingleton)?.providesMap.get('child')?.type).toBe(TestDiceChild);
        expect(type_desc_1.typeDescMap.get(TestSingleton)?.requiresMap.get('candy')?.type).toBe(TestCandy);
        expect(type_desc_1.typeDescMap.get(TestSingleton)?.persistentFields.has('myVal')).toBeTrue();
        expect(type_desc_1.typeDescMap.get(TestSingleton)?.persistentFields.has('myObj')).toBeTrue();
        expect(type_desc_1.typeDescMap.get(TestDiceChild)?.providesMap.get('grandchild')?.type).toBe(TestDiceGrandchild);
        expect(type_desc_1.typeDescMap.get(TestDiceEmpty)?.providesMap).toBeTruthy();
        expect(type_desc_1.typeDescMap.get(TestDiceEmpty)?.requiresMap).toBeTruthy();
    });
});
//# sourceMappingURL=type-desc.spec.js.map