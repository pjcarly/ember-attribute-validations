import Validator from "@getflights/ember-attribute-validations/validators/in";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "enum",
};

var validator = Validator.create({
  values: ["foo", "bar"],
  message: "%@ must be in range %@",
  attribute: attribute,
});

module("enum Validator test");

test("validate", function (assert) {
  assert.deepEqual(validator.validate("enum", "foo", attribute, {}), undefined);
  assert.deepEqual(validator.validate("enum", "bar", attribute, {}), undefined);

  // Should not validate empty values
  assert.deepEqual(
    validator.validate("enum", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("enum", null, attribute, {}), undefined);
  assert.deepEqual(validator.validate("enum", "", attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("enum", "vlada.spasic@gmail.com", attribute, {}),
    "Enum must be in range foo, bar"
  );
  assert.deepEqual(
    validator.validate("enum", "vlada.1234.e@dev.dom.net", attribute, {}),
    "Enum must be in range foo, bar"
  );
  assert.deepEqual(
    validator.validate("enum", false, attribute, {}),
    "Enum must be in range foo, bar"
  );
  assert.deepEqual(
    validator.validate("enum", "some value", attribute, {}),
    "Enum must be in range foo, bar"
  );
});
