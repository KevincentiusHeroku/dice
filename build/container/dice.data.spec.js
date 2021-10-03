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
exports.DiceTestParent = void 0;
const field_annotation_1 = require("../annotations/field-annotation");
const scope_annotation_1 = require("../annotations/scope-annotation");
const dice_spec_1 = require("./dice.spec");
let DiceTestParent = class DiceTestParent {
    providedByAll;
    providedByChild;
    providedByParent;
    providedByParentOnly;
    singleton;
    child;
};
__decorate([
    (0, field_annotation_1.provides)(dice_spec_1.DiceTestProvidedByAll),
    __metadata("design:type", dice_spec_1.DiceTestProvidedByAll)
], DiceTestParent.prototype, "providedByAll", void 0);
__decorate([
    (0, field_annotation_1.provides)(dice_spec_1.DiceTestProvidedByChild),
    __metadata("design:type", dice_spec_1.DiceTestProvidedByChild)
], DiceTestParent.prototype, "providedByChild", void 0);
__decorate([
    (0, field_annotation_1.provides)(dice_spec_1.DiceTestProvidedByParent),
    __metadata("design:type", dice_spec_1.DiceTestProvidedByParent)
], DiceTestParent.prototype, "providedByParent", void 0);
__decorate([
    (0, field_annotation_1.provides)(dice_spec_1.DiceTestProvidedByParentOnly),
    __metadata("design:type", dice_spec_1.DiceTestProvidedByParentOnly)
], DiceTestParent.prototype, "providedByParentOnly", void 0);
__decorate([
    (0, field_annotation_1.requires)(dice_spec_1.DiceTestSingleton),
    __metadata("design:type", dice_spec_1.DiceTestSingleton)
], DiceTestParent.prototype, "singleton", void 0);
__decorate([
    (0, field_annotation_1.provides)(dice_spec_1.DiceTestChild),
    __metadata("design:type", dice_spec_1.DiceTestChild)
], DiceTestParent.prototype, "child", void 0);
DiceTestParent = __decorate([
    (0, scope_annotation_1.singleton)('dice-test-parent')
], DiceTestParent);
exports.DiceTestParent = DiceTestParent;
//# sourceMappingURL=dice.data.spec.js.map