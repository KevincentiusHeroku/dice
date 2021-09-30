import { contains, provides, requires, typeToContainsMap, typeToProvidesMap, typeToRequiresMap } from "./field-annotation";
import { dice } from "./scope-annotation";

@dice()
class TestGreenService {}

@dice('lights')
class TestYellowService {}

@dice()
class TestExtService {}

@dice()
class TestContainedService {}

@dice()
class TestRedService {
  @provides(TestGreenService) private testGreenService!: TestGreenService;
  @provides(TestYellowService, 'lights') private testYellowService!: TestYellowService;
  @requires(TestExtService) private testExtService!: TestExtService;
  @contains(TestContainedService) private testContainedService!: TestContainedService;
}

describe('Provides annotation', () => {
  it('should register contained children in typeToContainsMap', () => {
    let containsMap = typeToContainsMap.get(TestRedService)!;
    expect(containsMap).toBeTruthy();
    expect(containsMap.get('testContainedService')).toBe(TestContainedService);
  });

  it('should register provided children in typeToProvidesMap', () => {
    let providesMap = typeToProvidesMap.get(TestRedService)!;
    expect(providesMap).toBeTruthy();

    const greenField = providesMap.get('testGreenService')!;
    expect(greenField.type).toBe(TestGreenService);
    expect(greenField.tags.length).toBe(0);

    const yellowField = providesMap.get('testYellowService')!;
    expect(yellowField.type).toBe(TestYellowService);
    expect(yellowField.tags.length).toBe(1);
    expect(yellowField.tags[0]).toBe('lights');
  });

  it('should register required references in typeToRequiresMap', () => {
    let requiresMap = typeToRequiresMap.get(TestRedService)!;
    expect(requiresMap).toBeTruthy();

    const extField = requiresMap.get('testExtService')!;
    expect(extField.type).toBe(TestExtService);
    expect(extField.tag).toBeFalsy();
  })
});
