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
const field_annotation_1 = require("../annotations/field-annotation");
const scope_annotation_1 = require("../annotations/scope-annotation");
const container_1 = require("./container");
const dice_1 = require("./dice");
let TestNamedProvided3 = class TestNamedProvided3 {
    get() { return 3; }
};
TestNamedProvided3 = __decorate([
    (0, scope_annotation_1.dice)("test-named-provided-3")
], TestNamedProvided3);
let TestNamedProvided2 = class TestNamedProvided2 {
    get() { return 2; }
};
TestNamedProvided2 = __decorate([
    (0, scope_annotation_1.dice)("test-named-provided-2")
], TestNamedProvided2);
let TestNamedProvided1 = class TestNamedProvided1 {
    get() { return 1; }
};
TestNamedProvided1 = __decorate([
    (0, scope_annotation_1.dice)("test-named-provided-1")
], TestNamedProvided1);
let TestNamedCalc3 = class TestNamedCalc3 {
    provided3;
    provided2;
    provided1;
};
__decorate([
    (0, field_annotation_1.provides)(TestNamedProvided3),
    __metadata("design:type", TestNamedProvided3)
], TestNamedCalc3.prototype, "provided3", void 0);
__decorate([
    (0, field_annotation_1.requires)("test-named-provided-2"),
    __metadata("design:type", Object)
], TestNamedCalc3.prototype, "provided2", void 0);
__decorate([
    (0, field_annotation_1.requires)("test-named-provided-1"),
    __metadata("design:type", Object)
], TestNamedCalc3.prototype, "provided1", void 0);
TestNamedCalc3 = __decorate([
    (0, scope_annotation_1.dice)()
], TestNamedCalc3);
let TestNamedCalc2 = class TestNamedCalc2 {
    provided2;
    provided1;
    calc3;
};
__decorate([
    (0, field_annotation_1.provides)(TestNamedProvided2),
    __metadata("design:type", TestNamedProvided2)
], TestNamedCalc2.prototype, "provided2", void 0);
__decorate([
    (0, field_annotation_1.requires)("test-named-provided-1"),
    __metadata("design:type", Object)
], TestNamedCalc2.prototype, "provided1", void 0);
__decorate([
    (0, field_annotation_1.provides)(TestNamedCalc3),
    __metadata("design:type", TestNamedCalc3)
], TestNamedCalc2.prototype, "calc3", void 0);
TestNamedCalc2 = __decorate([
    (0, scope_annotation_1.dice)()
], TestNamedCalc2);
let TestNamedCalc1 = class TestNamedCalc1 {
    provided1;
    calc2;
};
__decorate([
    (0, field_annotation_1.provides)(TestNamedProvided1),
    __metadata("design:type", TestNamedProvided1)
], TestNamedCalc1.prototype, "provided1", void 0);
__decorate([
    (0, field_annotation_1.provides)(TestNamedCalc2),
    __metadata("design:type", TestNamedCalc2)
], TestNamedCalc1.prototype, "calc2", void 0);
TestNamedCalc1 = __decorate([
    (0, scope_annotation_1.singleton)("test-named-calc-1")
], TestNamedCalc1);
describe(dice_1.Dice.name + ' (named)', () => {
    it('should recursively autowire named dices', () => {
        const container = new container_1.Container();
        const calc1 = container.resolve("test-named-calc-1");
        expect(calc1 instanceof TestNamedCalc1).toBeTrue();
        expect(calc1.provided1 instanceof TestNamedProvided1).toBeTrue();
        const calc2 = calc1.calc2;
        expect(calc2 instanceof TestNamedCalc2).toBeTrue();
        expect(calc2.provided1).toBe(calc1.provided1);
        expect(calc2.provided2 instanceof TestNamedProvided2).toBeTrue();
        const calc3 = calc2.calc3;
        expect(calc3 instanceof TestNamedCalc3).toBeTrue();
        expect(calc3.provided1).toBe(calc1.provided1);
        expect(calc3.provided2).toBe(calc2.provided2);
        expect(calc3.provided3 instanceof TestNamedProvided3).toBeTrue();
    });
});
//# sourceMappingURL=dice.named.spec.js.map