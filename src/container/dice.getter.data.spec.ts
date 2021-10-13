
import { provides } from "..";
import { singleton } from "../annotations/scope-annotation";
import { TestGetterTypes } from "./dice.getter.data.2.spec";
import { TestGetterChild, TestGetterShouter } from "./dice.getter.spec";

@singleton('test-getter-parent')
export class TestGetterParent {
  @provides(TestGetterChild) child!: TestGetterChild;
  @provides(undefined, TestGetterTypes.SHOUTER) shouter!: TestGetterShouter;
}
