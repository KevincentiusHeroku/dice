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
let SnapshotTestChild1 = class SnapshotTestChild1 {
    val = 0;
    pval = 0;
    snapshot() { return this.val * 100; }
    restore(val) { this.val = val / 100; }
};
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], SnapshotTestChild1.prototype, "pval", void 0);
SnapshotTestChild1 = __decorate([
    (0, scope_annotation_1.dice)()
], SnapshotTestChild1);
let SnapshotTestChild2 = class SnapshotTestChild2 {
    val = 0;
    pval = 0;
    child1;
    snapshot() { return this.val * 1000; }
    restore(val) { this.val = val / 1000; }
};
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], SnapshotTestChild2.prototype, "pval", void 0);
__decorate([
    (0, field_annotation_1.requires)(SnapshotTestChild1),
    __metadata("design:type", SnapshotTestChild1)
], SnapshotTestChild2.prototype, "child1", void 0);
SnapshotTestChild2 = __decorate([
    (0, scope_annotation_1.dice)()
], SnapshotTestChild2);
let SnapshotTestParent = class SnapshotTestParent {
    child1;
    child2;
    val = 0;
    pval = 0;
    snapshot() { return this.val * 10; }
    restore(val) { this.val = val / 10; }
};
__decorate([
    (0, field_annotation_1.provides)(SnapshotTestChild1),
    __metadata("design:type", SnapshotTestChild1)
], SnapshotTestParent.prototype, "child1", void 0);
__decorate([
    (0, field_annotation_1.provides)(SnapshotTestChild2),
    __metadata("design:type", SnapshotTestChild2)
], SnapshotTestParent.prototype, "child2", void 0);
__decorate([
    (0, field_annotation_1.persistent)(),
    __metadata("design:type", Object)
], SnapshotTestParent.prototype, "pval", void 0);
SnapshotTestParent = __decorate([
    (0, scope_annotation_1.dice)()
], SnapshotTestParent);
describe(serializer_1.Serializer + ' (snapshot/restore)', () => {
    it('should persist both @persistent fields and snapshot()', () => {
        const container = new container_1.Container();
        const serializer = container.resolve(serializer_1.Serializer);
        const parent = container.resolve(SnapshotTestParent);
        parent.val = 1;
        parent.pval = 2;
        parent.child1.val = 3;
        parent.child1.pval = 4;
        parent.child2.val = 5;
        parent.child2.pval = 6;
        const memento = serializer.serialize(parent);
        expect(memento.snapshot).toBe(10);
        expect(memento.pval).toBe(2);
        expect(memento.child1.snapshot).toBe(300);
        expect(memento.child1.pval).toBe(4);
        expect(memento.child2.snapshot).toBe(5000);
        expect(memento.child2.pval).toBe(6);
        const restored = serializer.restore(SnapshotTestParent, memento);
        expect(restored.val).toBe(1);
        expect(restored.pval).toBe(2);
        expect(restored.child1.val).toBe(3);
        expect(restored.child1.pval).toBe(4);
        expect(restored.child2.val).toBe(5);
        expect(restored.child2.pval).toBe(6);
        expect(restored.child2.child1).toBe(restored.child1);
    });
});
//# sourceMappingURL=serializer.snapshot.spec.js.map