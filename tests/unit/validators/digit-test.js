import Validator from "@getflights/ember-attribute-validations/validators/digit";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "Digit",
};

var validator = Validator.create({
  message: "%@ must be a digit",
  attribute: attribute,
});

module("Digit Validator test");

test("validate", function (assert) {
  assert.deepEqual(validator.validate("digit", 1, attribute, {}), undefined);
  assert.deepEqual(validator.validate("digit", 9, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("digit", "12345", attribute, {}),
    undefined
  );

  // Should not validate empty values
  assert.deepEqual(validator.validate("digit", null, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("digit", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("digit", "", attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("digit", false, attribute, {}),
    "Digit must be a digit"
  );
  assert.deepEqual(
    validator.validate("digit", "some value", attribute, {}),
    "Digit must be a digit"
  );
});
