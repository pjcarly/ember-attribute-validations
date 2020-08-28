import Validator from "@getflights/ember-attribute-validations/validators/max";
import { module, test } from "qunit";

module("Max Validator test");

test("test missing max value", function (assert) {
  var attribute = {
    type: "string",
    options: {},
    name: "email",
  };

  var validator = Validator.create({
    attribute: attribute,
  });

  assert.throws(
    function () {
      validator.validate("email", "value", attribute);
    },
    function (err) {
      return (
        err.message ===
        "Assertion Failed: You must define a `max` for MaxValidator"
      );
    }
  );
});

test("validate string", function (assert) {
  var attribute = {
    type: "string",
    options: {},
    name: "email",
  };

  var validator = Validator.create({
    message: "%@ must not be longer than %@",
    max: 10,
    attribute: attribute,
  });

  assert.deepEqual(validator.validate("email", "v", attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("email", "vlada", attribute, {}),
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
    "Email must not be longer than 10"
  );
  assert.deepEqual(
    validator.validate("email", "some email value", attribute, {}),
    "Email must not be longer than 10"
  );
});

test("validate number", function (assert) {
  var attribute = {
    type: "number",
    options: {},
    name: "rating",
  };

  var validator = Validator.create({
    message: "%@ must not be bigger than %@",
    max: 5,
    attribute: attribute,
  });

  assert.deepEqual(validator.validate("rating", "3", attribute, {}), undefined);
  assert.deepEqual(validator.validate("rating", 1, attribute, {}), undefined);

  // Should not validate empty values
  assert.deepEqual(validator.validate("email", null, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("email", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("email", "", attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("rating", false, attribute, {}),
    "Rating must not be bigger than 5"
  );
  assert.deepEqual(
    validator.validate("rating", 6, attribute, {}),
    "Rating must not be bigger than 5"
  );
  assert.deepEqual(
    validator.validate("rating", 8, attribute, {}),
    "Rating must not be bigger than 5"
  );
});
