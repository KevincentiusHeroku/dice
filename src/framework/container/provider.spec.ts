import { createQuery, Scope, Type, typeDescMap } from "../container/type-desc";
import { Provider } from "./provider";

class ProviderTestClass {}
class ProviderTestUniqueClass {}

describe('Provider', () => {
  it('should provide registered intances either by type or tag', () => {
    let provider = new Provider();
    let instance1 = new ProviderTestClass();
    let instance2 = new ProviderTestClass();
    let instanceUnique = new ProviderTestUniqueClass();

    provider.register(ProviderTestClass, instance1, "instance1", "instance_one", 'instance');
    provider.register(ProviderTestClass, instance2, "instance2", "instance_two", 'instance');
    provider.register(ProviderTestUniqueClass, instanceUnique);

    expect(provider.get(createQuery(ProviderTestUniqueClass))).toBe(instanceUnique);
    expect(() => provider.get(createQuery(ProviderTestClass))).toThrow();
    expect(provider.get(createQuery('instance1'))).toBe(instance1);
    expect(provider.get(createQuery('instance_one'))).toBe(instance1);
    expect(provider.get(createQuery('instance2'))).toBe(instance2);
    expect(provider.get(createQuery('instance_two'))).toBe(instance2);
    expect(() => provider.get(createQuery('instance'))).toThrow();
    expect(() => provider.get(createQuery('not_registered_tag'))).toThrow();
    expect(() => provider.get(createQuery('instance'))).toThrow();

    expect(provider.getIfExists(createQuery(ProviderTestUniqueClass))).toBe(instanceUnique);
    expect(() => provider.getIfExists(createQuery(ProviderTestClass))).toThrow();
    expect(provider.getIfExists(createQuery('instance1'))).toBe(instance1);
    expect(provider.getIfExists(createQuery('instance_one'))).toBe(instance1);
    expect(provider.getIfExists(createQuery('instance2'))).toBe(instance2);
    expect(provider.getIfExists(createQuery('instance_two'))).toBe(instance2);
    expect(() => provider.getIfExists(createQuery('instance'))).toThrow();
    expect(provider.getIfExists(createQuery('not_registered_tag'))).toBeNull();
    expect(() => provider.getIfExists(createQuery('instance'))).toThrow();
  });
});
