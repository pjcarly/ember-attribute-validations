import Validator from "@getflights/ember-attribute-validations/validators/range";
import { module, test } from "qunit";

module("Range Validator test");

test("test missing from value", function (assert) {
  var attribute = {
    type: "string",
    options: {},
    name: "email",
  };

  var validator = Validator.create({
    attribute,
  });

  assert.throws(
    function () {
      validator.validate("email", "value", attribute);
    },
    function (err) {
      return (
        err.message ===
        "Assertion Failed: You must define a `from` for RangeValidator"
      );
    }
  );
});

test("test missing to value", function (assert) {
  var attribute = {
    type: "string",
    options: {},
    name: "email",
  };

  var validator = Validator.create({
    from: 1,
    attribute: attribute,
  });

  assert.throws(
    function () {
      validator.validate("email", "value", attribute);
    },
    function (err) {
      return (
        err.message ===
        "Assertion Failed: You must define a `to` for RangeValidator"
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
    message: "%@ must not be smaller than %@ and bigger than %@",
    from: 3,
    to: 10,
    attribute: attribute,
  });

  assert.deepEqual(
    validator.validate("email", "vladimir", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("email", "vlada", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("email", "some email", attribute, {}),
    undefined
  );

  assert.deepEqual(
    validator.validate("email", "", attribute, {}),
    "Email must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("email", "fo", attribute, {}),
    "Email must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("email", null, attribute, {}),
    "Email must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("email", false, attribute, {}),
    "Email must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("email", undefined, attribute, {}),
    "Email must not be smaller than 3 and bigger than 10"
  );
});

test("validate number", function (assert) {
  var attribute = {
    type: "number",
    options: {},
    name: "attribute",
  };

  var validator = Validator.create({
    message: "%@ must not be smaller than %@ and bigger than %@",
    from: 3,
    to: 10,
    attribute: attribute,
  });

  assert.deepEqual(
    validator.validate("attribute", "3", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("attribute", "9", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("attribute", 8, attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("attribute", 4, attribute, {}),
    undefined
  );

  assert.deepEqual(
    validator.validate("attribute", 11, attribute, {}),
    "Attribute must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("attribute", "2", attribute, {}),
    "Attribute must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("attribute", null, attribute, {}),
    "Attribute must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("attribute", false, attribute, {}),
    "Attribute must not be smaller than 3 and bigger than 10"
  );
  assert.deepEqual(
    validator.validate("attribute", undefined, attribute, {}),
    "Attribute must not be smaller than 3 and bigger than 10"
  );
});
