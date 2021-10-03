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
let ContainerSpecRequiredSingleton = class ContainerSpecRequiredSingleton {
};
ContainerSpecRequiredSingleton = __decorate([
    (0, scope_annotation_1.singleton)()
], ContainerSpecRequiredSingleton);
let ContainerSpecContainedDice = class ContainerSpecContainedDice {
};
ContainerSpecContainedDice = __decorate([
    (0, scope_annotation_1.dice)()
], ContainerSpecContainedDice);
let ContainerSpecSingleton = class ContainerSpecSingleton {
    requiredSingleton;
    containedDice;
};
__decorate([
    (0, field_annotation_1.requires)(ContainerSpecRequiredSingleton),
    __metadata("design:type", ContainerSpecRequiredSingleton)
], ContainerSpecSingleton.prototype, "requiredSingleton", void 0);
__decorate([
    (0, field_annotation_1.contains)(ContainerSpecContainedDice),
    __metadata("design:type", ContainerSpecContainedDice)
], ContainerSpecSingleton.prototype, "containedDice", void 0);
ContainerSpecSingleton = __decorate([
    (0, scope_annotation_1.singleton)()
], ContainerSpecSingleton);
let ContainerSpecTaggedSingleton = class ContainerSpecTaggedSingleton {
};
ContainerSpecTaggedSingleton = __decorate([
    (0, scope_annotation_1.singleton)('container-spec-tagged-service')
], ContainerSpecTaggedSingleton);
let ContainerSpecDice = class ContainerSpecDice {
    requiredSingleton;
    containedDice;
};
__decorate([
    (0, field_annotation_1.requires)(ContainerSpecRequiredSingleton),
    __metadata("design:type", ContainerSpecRequiredSingleton)
], ContainerSpecDice.prototype, "requiredSingleton", void 0);
__decorate([
    (0, field_annotation_1.contains)(ContainerSpecContainedDice),
    __metadata("design:type", ContainerSpecContainedDice)
], ContainerSpecDice.prototype, "containedDice", void 0);
ContainerSpecDice = __decorate([
    (0, scope_annotation_1.dice)()
], ContainerSpecDice);
let ContainerSpecTaggedDice = class ContainerSpecTaggedDice {
    requiredSingleton;
    containedDice;
};
__decorate([
    (0, field_annotation_1.requires)(ContainerSpecRequiredSingleton),
    __metadata("design:type", ContainerSpecRequiredSingleton)
], ContainerSpecTaggedDice.prototype, "requiredSingleton", void 0);
__decorate([
    (0, field_annotation_1.contains)(ContainerSpecContainedDice),
    __metadata("design:type", ContainerSpecContainedDice)
], ContainerSpecTaggedDice.prototype, "containedDice", void 0);
ContainerSpecTaggedDice = __decorate([
    (0, scope_annotation_1.dice)('container-spec-tagged-dice')
], ContainerSpecTaggedDice);
let ContainerSpecDuplicateSingleton1 = class ContainerSpecDuplicateSingleton1 {
};
ContainerSpecDuplicateSingleton1 = __decorate([
    (0, scope_annotation_1.dice)('container-spec-duplicate-singleton')
], ContainerSpecDuplicateSingleton1);
let ContainerSpecDuplicateSingleton2 = class ContainerSpecDuplicateSingleton2 {
};
ContainerSpecDuplicateSingleton2 = __decorate([
    (0, scope_annotation_1.dice)('container-spec-duplicate-singleton')
], ContainerSpecDuplicateSingleton2);
describe('Container', () => {
    it('should provide an autowired instance when queried for singleton by type', () => {
        const container = new container_1.Container();
        const sing = container.resolve(ContainerSpecSingleton);
        expectAutowired(sing);
    });
    it('should provide the same instance everytime when queried for singleton by type', () => {
        let container = new container_1.Container();
        let singleton1 = container.resolve(ContainerSpecSingleton);
        let singleton2 = container.resolve(ContainerSpecSingleton);
        expect(singleton1 === singleton2).toBeTrue();
        expect(singleton1 instanceof ContainerSpecSingleton).toBeTrue();
    });
    it('should provide the same instance everytime when queried for singleton by tag', () => {
        let container = new container_1.Container();
        let singleton1 = container.resolve('container-spec-tagged-service');
        let singleton2 = container.resolve('container-spec-tagged-service');
        expect(singleton1 === singleton2).toBeTrue();
        expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
    });
    it('should provide the same instance everytime when queried for singleton by either type or tag', () => {
        let container = new container_1.Container();
        let singleton1 = container.resolve(ContainerSpecTaggedSingleton);
        let singleton2 = container.resolve('container-spec-tagged-service');
        expect(singleton1 === singleton2).toBeTrue();
        expect(singleton1 instanceof ContainerSpecTaggedSingleton).toBeTrue();
    });
    it('should provide an autowired instance when queried for dice by type', () => {
        const container = new container_1.Container();
        const dice1 = container.resolve(ContainerSpecDice);
        expectAutowired(dice1);
    });
    it('should provide an autowired instance when queried for dice by tag', () => {
        const container = new container_1.Container();
        const dice1 = container.resolve('container-spec-tagged-dice');
        expectAutowired(dice1);
    });
    it('should provide a new instance everytime when queried for dice by type', () => {
        let container = new container_1.Container();
        let dice1 = container.resolve(ContainerSpecDice);
        let dice2 = container.resolve(ContainerSpecDice);
        expect(dice1 === dice2).toBeFalse();
        expect(dice1 instanceof ContainerSpecDice).toBeTrue();
    });
    it('should provide a new instance everytime when queried for dice by tag', () => {
        let container = new container_1.Container();
        let dice1 = container.resolve('container-spec-tagged-dice');
        let dice2 = container.resolve('container-spec-tagged-dice');
        expect(dice1 === dice2).toBeFalse();
        expect(dice1 instanceof ContainerSpecTaggedDice).toBeTrue();
    });
    it('should throw an error if multiple instances matches the query', () => {
        let container = new container_1.Container();
        expect(() => container.resolve('container-spec-duplicate-singleton')).toThrow();
    });
});
function expectAutowired(sing) {
    expect(sing).toBeTruthy();
    expect(sing.requiredSingleton instanceof ContainerSpecRequiredSingleton).toBeTrue();
    expect(sing.containedDice instanceof ContainerSpecContainedDice).toBeTrue();
}
//# sourceMappingURL=container.spec.js.map