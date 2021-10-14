import { createContainer } from "..";
import { provides, contains } from "../annotations/field-annotation";
import { dice, singleton } from "../annotations/scope-annotation";
import { getResolver } from "./resolver";

@singleton('resolver-test-singleton')
class ResolverTestSingleton {}

@dice()
class ResolverTestChild {}

@dice()
class ResolverTestProvided {}

@dice()
class ResolverTestParent {
  @contains(ResolverTestChild) child!: ResolverTestChild;
  @provides(ResolverTestProvided) prov!: ResolverTestProvided;
}

describe('Resolver', () => {
  it('should resolve dices from the instance\'s scope', () => {
    const container = createContainer();
    const parent = container.resolve(ResolverTestParent);
    const childResolver = getResolver(parent.child);
    const singleton = container.resolve(ResolverTestSingleton);
    expect(childResolver.resolve(ResolverTestParent)).toBe(parent);
    expect(childResolver.resolve(ResolverTestSingleton)).toBe(singleton);
    expect(childResolver.resolveTag('resolver-test-singleton')).toBe(singleton);

    const otherChild = container.resolve(ResolverTestChild);
    const otherResolver = getResolver(otherChild);
    expect(otherResolver.resolve(ResolverTestParent) === parent).toBeFalse();
    expect(otherResolver.resolve(ResolverTestSingleton)).toBe(singleton);
    expect(otherResolver.resolveTag('resolver-test-singleton')).toBe(singleton);

    const outsideChild = createContainer().resolve(ResolverTestChild);
    const outsideResolver = getResolver(outsideChild);
    expect(outsideResolver.resolve(ResolverTestSingleton) === singleton).toBeFalse();
    expect(outsideResolver.resolveTag('resolver-test-singleton') === singleton).toBeFalse();
  });
});
