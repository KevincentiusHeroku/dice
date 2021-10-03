"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_desc_1 = require("../annotations/type-desc");
const provider_1 = require("./provider");
class ProviderTestClass {
}
class ProviderTestUniqueClass {
}
describe('Provider', () => {
    it('should provide registered intances either by type or tag', () => {
        let provider = new provider_1.Provider();
        let instance1 = new ProviderTestClass();
        let instance2 = new ProviderTestClass();
        let instanceUnique = new ProviderTestUniqueClass();
        provider.register(ProviderTestClass, instance1, "instance1", "instance_one", 'instance');
        provider.register(ProviderTestClass, instance2, "instance2", "instance_two", 'instance');
        provider.register(ProviderTestUniqueClass, instanceUnique);
        expect(provider.get((0, type_desc_1.createQuery)(ProviderTestUniqueClass))).toBe(instanceUnique);
        expect(() => provider.get((0, type_desc_1.createQuery)(ProviderTestClass))).toThrow();
        expect(provider.get((0, type_desc_1.createQuery)('instance1'))).toBe(instance1);
        expect(provider.get((0, type_desc_1.createQuery)('instance_one'))).toBe(instance1);
        expect(provider.get((0, type_desc_1.createQuery)('instance2'))).toBe(instance2);
        expect(provider.get((0, type_desc_1.createQuery)('instance_two'))).toBe(instance2);
        expect(() => provider.get((0, type_desc_1.createQuery)('instance'))).toThrow();
        expect(() => provider.get((0, type_desc_1.createQuery)('not_registered_tag'))).toThrow();
        expect(() => provider.get((0, type_desc_1.createQuery)('instance'))).toThrow();
        expect(provider.getIfExists((0, type_desc_1.createQuery)(ProviderTestUniqueClass))).toBe(instanceUnique);
        expect(() => provider.getIfExists((0, type_desc_1.createQuery)(ProviderTestClass))).toThrow();
        expect(provider.getIfExists((0, type_desc_1.createQuery)('instance1'))).toBe(instance1);
        expect(provider.getIfExists((0, type_desc_1.createQuery)('instance_one'))).toBe(instance1);
        expect(provider.getIfExists((0, type_desc_1.createQuery)('instance2'))).toBe(instance2);
        expect(provider.getIfExists((0, type_desc_1.createQuery)('instance_two'))).toBe(instance2);
        expect(() => provider.getIfExists((0, type_desc_1.createQuery)('instance'))).toThrow();
        expect(provider.getIfExists((0, type_desc_1.createQuery)('not_registered_tag'))).toBeNull();
        expect(() => provider.getIfExists((0, type_desc_1.createQuery)('instance'))).toThrow();
    });
});
//# sourceMappingURL=provider.spec.js.map