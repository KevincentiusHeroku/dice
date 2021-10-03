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
exports.DiceTestChild = exports.DiceTestGrandchild = exports.DiceTestSingleton = exports.DiceTestProvidedByParentOnly = exports.DiceTestProvidedByParent = exports.DiceTestProvidedByChild = exports.DiceTestProvidedByAll = void 0;
const field_annotation_1 = require("../annotations/field-annotation");
const scope_annotation_1 = require("../annotations/scope-annotation");
const container_1 = require("./container");
const dice_1 = require("./dice");
const dice_data_spec_1 = require("./dice.data.spec");
let DiceTestProvidedByAll = class DiceTestProvidedByAll {
};
DiceTestProvidedByAll = __decorate([
    (0, scope_annotation_1.dice)()
], DiceTestProvidedByAll);
exports.DiceTestProvidedByAll = DiceTestProvidedByAll;
let DiceTestProvidedByChild = class DiceTestProvidedByChild {
};
DiceTestProvidedByChild = __decorate([
    (0, scope_annotation_1.dice)()
], DiceTestProvidedByChild);
exports.DiceTestProvidedByChild = DiceTestProvidedByChild;
let DiceTestProvidedByParent = class DiceTestProvidedByParent {
};
DiceTestProvidedByParent = __decorate([
    (0, scope_annotation_1.dice)()
], DiceTestProvidedByParent);
exports.DiceTestProvidedByParent = DiceTestProvidedByParent;
let DiceTestProvidedByParentOnly = class DiceTestProvidedByParentOnly {
    providedByAll;
};
__decorate([
    (0, field_annotation_1.contains)(DiceTestProvidedByAll),
    __metadata("design:type", DiceTestProvidedByAll)
], DiceTestProvidedByParentOnly.prototype, "providedByAll", void 0);
DiceTestProvidedByParentOnly = __decorate([
    (0, scope_annotation_1.dice)()
], DiceTestProvidedByParentOnly);
exports.DiceTestProvidedByParentOnly = DiceTestProvidedByParentOnly;
let DiceTestSingleton = class DiceTestSingleton {
};
DiceTestSingleton = __decorate([
    (0, scope_annotation_1.singleton)()
], DiceTestSingleton);
exports.DiceTestSingleton = DiceTestSingleton;
let DiceTestGrandchild = class DiceTestGrandchild {
    providedByAll;
    providedByChild;
    providedByParent;
    providedByParentOnly;
    singleton;
};
__decorate([
    (0, field_annotation_1.provides)(DiceTestProvidedByAll),
    __metadata("design:type", DiceTestProvidedByAll)
], DiceTestGrandchild.prototype, "providedByAll", void 0);
__decorate([
    (0, field_annotation_1.requires)(DiceTestProvidedByChild),
    __metadata("design:type", DiceTestProvidedByChild)
], DiceTestGrandchild.prototype, "providedByChild", void 0);
__decorate([
    (0, field_annotation_1.requires)(DiceTestProvidedByParent),
    __metadata("design:type", DiceTestProvidedByParent)
], DiceTestGrandchild.prototype, "providedByParent", void 0);
__decorate([
    (0, field_annotation_1.requires)(DiceTestProvidedByParentOnly),
    __metadata("design:type", DiceTestProvidedByParentOnly)
], DiceTestGrandchild.prototype, "providedByParentOnly", void 0);
__decorate([
    (0, field_annotation_1.requires)(DiceTestSingleton),
    __metadata("design:type", DiceTestSingleton)
], DiceTestGrandchild.prototype, "singleton", void 0);
DiceTestGrandchild = __decorate([
    (0, scope_annotation_1.dice)()
], DiceTestGrandchild);
exports.DiceTestGrandchild = DiceTestGrandchild;
let DiceTestChild = class DiceTestChild {
    providedByAll;
    providedByChild;
    providedByParent;
    providedByParentOnly;
    singleton;
    grandChild;
    parent;
};
__decorate([
    (0, field_annotation_1.provides)(DiceTestProvidedByAll),
    __metadata("design:type", DiceTestProvidedByAll)
], DiceTestChild.prototype, "providedByAll", void 0);
__decorate([
    (0, field_annotation_1.provides)(DiceTestProvidedByChild),
    __metadata("design:type", DiceTestProvidedByChild)
], DiceTestChild.prototype, "providedByChild", void 0);
__decorate([
    (0, field_annotation_1.requires)(DiceTestProvidedByParent),
    __metadata("design:type", DiceTestProvidedByParent)
], DiceTestChild.prototype, "providedByParent", void 0);
__decorate([
    (0, field_annotation_1.contains)(DiceTestProvidedByParentOnly),
    __metadata("design:type", DiceTestProvidedByParentOnly)
], DiceTestChild.prototype, "providedByParentOnly", void 0);
__decorate([
    (0, field_annotation_1.requires)(DiceTestSingleton),
    __metadata("design:type", DiceTestSingleton)
], DiceTestChild.prototype, "singleton", void 0);
__decorate([
    (0, field_annotation_1.provides)(DiceTestGrandchild),
    __metadata("design:type", DiceTestGrandchild)
], DiceTestChild.prototype, "grandChild", void 0);
__decorate([
    (0, field_annotation_1.requires)('dice-test-parent'),
    __metadata("design:type", dice_data_spec_1.DiceTestParent)
], DiceTestChild.prototype, "parent", void 0);
DiceTestChild = __decorate([
    (0, scope_annotation_1.dice)()
], DiceTestChild);
exports.DiceTestChild = DiceTestChild;
describe(dice_1.Dice.name, () => {
    it('should recursively autowire dices', () => {
        const container = new container_1.Container();
        const sing = container.resolve(DiceTestSingleton);
        expect(sing instanceof DiceTestSingleton).toBeTrue();
        const parent = container.resolve(dice_data_spec_1.DiceTestParent);
        expect(parent instanceof dice_data_spec_1.DiceTestParent).toBeTrue();
        expect(parent.singleton).toBe(sing);
        expect(parent.providedByParent instanceof DiceTestProvidedByParent).toBeTrue();
        expect(parent.providedByChild instanceof DiceTestProvidedByChild).toBeTrue();
        expect(parent.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
        expect(parent.providedByParentOnly instanceof DiceTestProvidedByParentOnly).toBeTrue();
        const child = parent.child;
        expect(child instanceof DiceTestChild).toBeTrue();
        expect(child.singleton).toBe(sing);
        expect(child.providedByParent).toBe(parent.providedByParent);
        expect(child.providedByChild instanceof DiceTestProvidedByChild).toBeTrue();
        expect(child.providedByChild == parent.providedByChild).toBeFalse();
        expect(child.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
        expect(child.providedByAll == parent.providedByAll).toBeFalse();
        expect(child.providedByParentOnly instanceof DiceTestProvidedByParentOnly).toBeTrue();
        expect(child.providedByParentOnly == parent.providedByParentOnly)
            .withContext('child declares the field with @contains rather than @requires, so it should get a new instance')
            .toBeFalse();
        expect(child.parent).toBe(parent);
        const grandChild = child.grandChild;
        expect(grandChild instanceof DiceTestGrandchild).toBeTrue();
        expect(grandChild.singleton).toBe(sing);
        expect(grandChild.providedByParent).toBe(parent.providedByParent);
        expect(grandChild.providedByChild).toBe(child.providedByChild);
        expect(grandChild.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
        expect(grandChild.providedByAll == parent.providedByAll).toBeFalse();
        expect(grandChild.providedByAll == child.providedByAll).toBeFalse();
        expect(grandChild.providedByParentOnly instanceof DiceTestProvidedByParentOnly).toBeTrue();
        expect(grandChild.providedByParentOnly == parent.providedByParentOnly)
            .withContext('child declares the field with @contains rather than @provides, so it doesn\'t resolve the query and bubbles the query up to the parent')
            .toBeTrue();
        expect(parent.providedByParentOnly.providedByAll instanceof DiceTestProvidedByAll).toBeTrue();
    });
});
//# sourceMappingURL=dice.spec.js.map