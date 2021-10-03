"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = exports.Container = exports.singleton = exports.dice = exports.persistent = exports.requires = exports.provides = exports.contains = void 0;
var field_annotation_1 = require("./annotations/field-annotation");
Object.defineProperty(exports, "contains", { enumerable: true, get: function () { return field_annotation_1.contains; } });
Object.defineProperty(exports, "provides", { enumerable: true, get: function () { return field_annotation_1.provides; } });
Object.defineProperty(exports, "requires", { enumerable: true, get: function () { return field_annotation_1.requires; } });
Object.defineProperty(exports, "persistent", { enumerable: true, get: function () { return field_annotation_1.persistent; } });
var scope_annotation_1 = require("./annotations/scope-annotation");
Object.defineProperty(exports, "dice", { enumerable: true, get: function () { return scope_annotation_1.dice; } });
Object.defineProperty(exports, "singleton", { enumerable: true, get: function () { return scope_annotation_1.singleton; } });
var container_1 = require("./container/container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return container_1.Container; } });
var serializer_1 = require("./serializer/serializer");
Object.defineProperty(exports, "Serializer", { enumerable: true, get: function () { return serializer_1.Serializer; } });
//# sourceMappingURL=index.js.map