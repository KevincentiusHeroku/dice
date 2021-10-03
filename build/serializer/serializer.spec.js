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
const container_1 = require("../container/container");
const dice_1 = require("../container/dice");
const serializer_1 = require("./serializer");
let TestSerializationSimple = class TestSerializationSimple {
    val = 'cereal';
    obj = {
        num: 5,
        str: 'cake',
        map: new Map(),
        inn: {
            arr: ['one', 'two', 'three'],
            set: new Set([4, 5, 6]),
        }
    };
    nonPersistent = 'badminton';
};
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestSerializationSimple.prototype, "val", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestSerializationSimple.prototype, "obj", void 0);
TestSerializationSimple = __decorate([
    (0, scope_annotation_1.dice)()
], TestSerializationSimple);
let TestSerializationProvided = class TestSerializationProvided {
    val = ['test1', 'test2', 'test3'];
};
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestSerializationProvided.prototype, "val", void 0);
TestSerializationProvided = __decorate([
    (0, scope_annotation_1.dice)()
], TestSerializationProvided);
let TestSerializedRequired = class TestSerializedRequired {
};
TestSerializedRequired = __decorate([
    (0, scope_annotation_1.singleton)()
], TestSerializedRequired);
let TestSerializationParent = class TestSerializationParent {
    simple;
    provided;
    required;
    val = 'bottle';
};
__decorate([
    (0, field_annotation_1.contains)(TestSerializationSimple),
    __metadata("design:type", TestSerializationSimple)
], TestSerializationParent.prototype, "simple", void 0);
__decorate([
    (0, field_annotation_1.provides)(TestSerializationProvided),
    __metadata("design:type", TestSerializationProvided)
], TestSerializationParent.prototype, "provided", void 0);
__decorate([
    (0, field_annotation_1.requires)(TestSerializedRequired),
    __metadata("design:type", TestSerializedRequired)
], TestSerializationParent.prototype, "required", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], TestSerializationParent.prototype, "val", void 0);
TestSerializationParent = __decorate([
    (0, scope_annotation_1.dice)()
], TestSerializationParent);
describe(dice_1.Dice.name + ' (serialization)', () => {
    it('should serialize @persistent fields in a dice', () => {
        const container = new container_1.Container();
        const serializer = container.resolve(serializer_1.Serializer);
        const before = container.resolve(TestSerializationSimple);
        const memento = serializer.serialize(before);
        expect(expectSimpleMemento(memento)).toBeTrue();
    });
    it('should recursively serialize @contains and @provides fields in a dice, but not @requires fields', () => {
        const container = new container_1.Container();
        const serializer = container.resolve(serializer_1.Serializer);
        const before = container.resolve(TestSerializationParent);
        const memento = serializer.serialize(before);
        expect(memento.val).toBe('bottle');
        expect(expectSimpleMemento(memento.simple)).toBeTrue();
        expect(memento.provided.val[1]).toBe('test2');
        expect(memento.required).toBeFalsy();
    });
    it('should restore the values of @persistent fields in a dice', () => {
        const container = new container_1.Container();
        const serializer = container.resolve(serializer_1.Serializer);
        const val = [5, 7, 9];
        const memento = {
            obj: val
        };
        const after = serializer.restore(TestSerializationSimple, memento);
        expect(after.obj).toBe(val);
    });
    it('should recursively restore @contains and @provides fields and autowire @requires fields', () => {
        const container = new container_1.Container();
        const serializer = container.resolve(serializer_1.Serializer);
        const testProvided = ['test4', 'test5', 'test6'];
        const memento = {
            simple: { obj: 'testSimple', val: 'button' },
            provided: { val: testProvided },
            val: 'fridge',
        };
        const after = serializer.restore(TestSerializationParent, memento);
        expect(after.val).toBe('fridge');
        expect(after.simple.val).toBe('button');
        expect(after.simple.obj).toBe('testSimple');
        expect(after.provided.val).toBe(testProvided);
        expect(after.required).toBe(container.resolve(TestSerializedRequired));
    });
    function expectSimpleMemento(memento) {
        expect(memento.val).toBe('cereal');
        expect(memento.obj.inn.arr[2]).toBe('three');
        expect(memento.obj.inn.set.has(5)).toBeTrue();
        expect(memento.nonPersistent).toBeUndefined();
        return true;
    }
});
//# sourceMappingURL=serializer.spec.js.map