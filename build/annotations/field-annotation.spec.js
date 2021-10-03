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
let TestGreenService = class TestGreenService {
};
TestGreenService = __decorate([
    (0, scope_annotation_1.dice)()
], TestGreenService);
let TestYellowService = class TestYellowService {
};
TestYellowService = __decorate([
    (0, scope_annotation_1.dice)('lights')
], TestYellowService);
let TestExtService = class TestExtService {
};
TestExtService = __decorate([
    (0, scope_annotation_1.dice)()
], TestExtService);
let TestContainedService = class TestContainedService {
};
TestContainedService = __decorate([
    (0, scope_annotation_1.dice)()
], TestContainedService);
let TestRedService = class TestRedService {
    testGreenService;
    testYellowService;
    testExtService;
    testContainedService;
    testPersistentNum = 5;
    testPersistentObj = { x: 'is me', y: { map: new Map(), arr: [1, 2, 3] } };
};
__decorate([
    (0, field_annotation_1.provides)(TestGreenService),
    __metadata("design:type", TestGreenService)
], TestRedService.prototype, "testGreenService", void 0);
__decorate([
    (0, field_annotation_1.provides)(TestYellowService, 'lights'),
    __metadata("design:type", TestYellowService)
], TestRedService.prototype, "testYellowService", void 0);
__decorate([
    (0, field_annotation_1.requires)(TestExtService),
    __metadata("design:type", TestExtService)
], TestRedService.prototype, "testExtService", void 0);
__decorate([
    (0, field_annotation_1.contains)(TestContainedService),
    __metadata("design:type", TestContainedService)
], TestRedService.prototype, "testContainedService", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestRedService.prototype, "testPersistentNum", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestRedService.prototype, "testPersistentObj", void 0);
TestRedService = __decorate([
    (0, scope_annotation_1.dice)()
], TestRedService);
describe('Provides annotation', () => {
    it('should register contained children in typeToContainsMap', () => {
        let containsMap = field_annotation_1.typeToContainsMap.get(TestRedService);
        expect(containsMap).toBeTruthy();
        expect(containsMap.get('testContainedService')).toBe(TestContainedService);
    });
    it('should register provided children in typeToProvidesMap', () => {
        let providesMap = field_annotation_1.typeToProvidesMap.get(TestRedService);
        expect(providesMap).toBeTruthy();
        const greenField = providesMap.get('testGreenService');
        expect(greenField.type).toBe(TestGreenService);
        expect(greenField.tags.length).toBe(0);
        const yellowField = providesMap.get('testYellowService');
        expect(yellowField.type).toBe(TestYellowService);
        expect(yellowField.tags.length).toBe(1);
        expect(yellowField.tags[0]).toBe('lights');
    });
    it('should register required references in typeToRequiresMap', () => {
        let requiresMap = field_annotation_1.typeToRequiresMap.get(TestRedService);
        expect(requiresMap).toBeTruthy();
        const extField = requiresMap.get('testExtService');
        expect(extField.type).toBe(TestExtService);
        expect(extField.tag).toBeFalsy();
    });
    it('should register persistent fields in typeToPersistentMap', () => {
        let persistentMap = field_annotation_1.typeToPersistentMap.get(TestRedService);
        expect(persistentMap).toBeTruthy();
        expect(persistentMap.has('testPersistentNum')).toBeTrue();
        expect(persistentMap.has('testPersistentObj')).toBeTrue();
    });
});
//# sourceMappingURL=field-annotation.spec.js.map