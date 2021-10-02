import { provides, requires } from "../annotations/field-annotation";
import { singleton } from "../annotations/scope-annotation";
import { DiceTestChild, DiceTestProvidedByAll, DiceTestProvidedByChild, DiceTestProvidedByParent, DiceTestProvidedByParentOnly, DiceTestSingleton } from "./dice.spec";

@singleton('dice-test-parent') 
export class DiceTestParent {
  @provides(DiceTestProvidedByAll) public providedByAll!: DiceTestProvidedByAll;
  @provides(DiceTestProvidedByChild) public providedByChild!: DiceTestProvidedByChild;
  @provides(DiceTestProvidedByParent) public providedByParent!: DiceTestProvidedByParent;
  @provides(DiceTestProvidedByParentOnly) public providedByParentOnly!: DiceTestProvidedByParentOnly;

  @requires(DiceTestSingleton) public singleton!: DiceTestSingleton;
  @provides(DiceTestChild) public child!: DiceTestChild;
}
