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
const serializer_1 = require("./serializer");
var Types;
(function (Types) {
    Types["SHOUTER"] = "serializer-child-test-shouter";
})(Types || (Types = {}));
let SerializerChildTestFoo = class SerializerChildTestFoo {
    shout() { return 'foo'; }
};
SerializerChildTestFoo = __decorate([
    (0, scope_annotation_1.dice)(Types.SHOUTER)
], SerializerChildTestFoo);
let SerializerChildTestBar = class SerializerChildTestBar {
    shout() { return 'bar'; }
};
SerializerChildTestBar = __decorate([
    (0, scope_annotation_1.dice)(Types.SHOUTER)
], SerializerChildTestBar);
let SerializerChildTestChild = class SerializerChildTestChild {
    shouter;
};
__decorate([
    (0, field_annotation_1.requires)(Types.SHOUTER),
    __metadata("design:type", Object)
], SerializerChildTestChild.prototype, "shouter", void 0);
SerializerChildTestChild = __decorate([
    (0, scope_annotation_1.dice)()
], SerializerChildTestChild);
let SerializerChildTestParent1 = class SerializerChildTestParent1 {
    foo;
};
__decorate([
    (0, field_annotation_1.provides)(SerializerChildTestFoo, Types.SHOUTER),
    __metadata("design:type", SerializerChildTestFoo)
], SerializerChildTestParent1.prototype, "foo", void 0);
SerializerChildTestParent1 = __decorate([
    (0, scope_annotation_1.dice)()
], SerializerChildTestParent1);
let SerializerChildTestParent2 = class SerializerChildTestParent2 {
    bar;
};
__decorate([
    (0, field_annotation_1.provides)(SerializerChildTestBar, Types.SHOUTER),
    __metadata("design:type", SerializerChildTestBar)
], SerializerChildTestParent2.prototype, "bar", void 0);
SerializerChildTestParent2 = __decorate([
    (0, scope_annotation_1.dice)()
], SerializerChildTestParent2);
describe(serializer_1.Serializer.name + ' (child)', () => {
    it('should ', () => {
        const container = new container_1.Container();
        const serializer = container.resolve(serializer_1.Serializer);
        const parent1 = container.resolve(SerializerChildTestParent1);
        const parent2 = container.resolve(SerializerChildTestParent2);
        const memento = {};
        expect(serializer.restore(SerializerChildTestChild, memento, parent1).shouter.shout()).toBe('foo');
        expect(serializer.restore(SerializerChildTestChild, memento, parent2).shouter.shout()).toBe('bar');
    });
});
//# sourceMappingURL=serializer.child.spec.js.map