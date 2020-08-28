import Validator from "@getflights/ember-attribute-validations/validators/email";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "email",
};

var validator = Validator.create({
  message: "%@ must be a valid email",
  attribute: attribute,
});

module("Email Validator test");

test("validate", function (assert) {
  assert.deepEqual(
    validator.validate("email", "vlada.spasic@gmail.com", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("email", "vlada.1234.e@dev.dom.net", attribute, {}),
    undefined
  );

  // Should not validate empty values
  assert.deepEqual(validator.validate("email", null, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("email", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("email", "", attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("email", false, attribute, {}),
    "Email must be a valid email"
  );
  assert.deepEqual(
    validator.validate("email", "some value", attribute, {}),
    "Email must be a valid email"
  );
});
