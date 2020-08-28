import Validator from "@getflights/ember-attribute-validations/validators/required";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "check",
};

var validator = Validator.create({
  message: "%@ is required",
  attribute: attribute,
});

module("Required Validator test");

test("validate", function (assert) {
  assert.deepEqual(validator.validate("check", true, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("check", "true", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("check", false, attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("check", "some value", attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("check", 0, attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("check", "", attribute, {}),
    "Check is required"
  );
  assert.deepEqual(
    validator.validate("check", null, attribute, {}),
    "Check is required"
  );
  assert.deepEqual(
    validator.validate("check", undefined, attribute, {}),
    "Check is required"
  );
});
