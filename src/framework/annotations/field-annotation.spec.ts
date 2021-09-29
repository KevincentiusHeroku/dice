import { typeToProvidesMap, typeToRequiresMap } from "../container/type-desc";
import { provides, requires } from "./field-annotation";
import { dice } from "./scope-annotation";

@dice()
class TestGreenService {}

@dice('lights')
class TestYellowService {}

@dice()
class TestExtService {}

@dice()
class TestRedService {
  @provides(TestGreenService) private testGreenService!: TestGreenService;
  @provides(TestYellowService, 'lights') private testYellowService!: TestYellowService;
  @requires(TestExtService) private testExtService!: TestExtService;
}

describe('Provides annotation', () => {
  it('should register provided children in typeProvidesMap', () => {
    let providesMap = typeToProvidesMap.get(TestRedService)!;
    expect(providesMap).toBeTruthy();

    const greenField = providesMap.get('testGreenService')!;
    expect(greenField.type).toBe(TestGreenService);
    expect(greenField.tags.length).toBe(0);

    const yellowField = providesMap.get('testYellowService')!;
    expect(yellowField.type).toBe(TestYellowService);
    expect(yellowField.tags.length).toBe(1);
    expect(yellowField.tags[0]).toBe('lights');


    let requiresMap = typeToRequiresMap.get(TestRedService)!;
    expect(requiresMap).toBeTruthy();

    const extField = requiresMap.get('testExtService')!;
    expect(extField.type).toBe(TestExtService);
    expect(extField.tag).toBeFalsy();
  });
});
