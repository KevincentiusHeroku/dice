
import { provides } from "../annotations/field-annotation";
import { dice } from "../annotations/scope-annotation";
import { TestGetterChild, TestGetterShouter, TestGetterTypes } from "./dice.getter.spec";

@dice('test-getter-parent')
export class TestGetterParent {
  @provides(TestGetterChild) child!: TestGetterChild;
  @provides(undefined, TestGetterTypes.SHOUTER) shouter!: TestGetterShouter;
}
