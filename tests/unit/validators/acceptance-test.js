import Validator from "@getflights/ember-attribute-validations/validators/acceptance";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "check",
};

var validator = Validator.create({
  message: "%@ must be checked",
  attribute: attribute,
});

module("Acceptance Validator test");

test("validate", function (assert) {
  assert.deepEqual(validator.validate("check", true, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("check", "true", attribute, {}),
    undefined
  );

  assert.deepEqual(
    validator.validate("check", null, attribute, {}),
    "Check must be checked"
  );
  assert.deepEqual(
    validator.validate("check", false, attribute, {}),
    "Check must be checked"
  );
  assert.deepEqual(
    validator.validate("check", undefined, attribute, {}),
    "Check must be checked"
  );
  assert.deepEqual(
    validator.validate("check", "some value", attribute, {}),
    "Check must be checked"
  );
});
