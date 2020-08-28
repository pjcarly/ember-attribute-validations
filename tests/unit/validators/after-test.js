import Validator from "@getflights/ember-attribute-validation/validators/after";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "Date",
};

var validator = Validator.create({
  message: "%@ must be after the set date",
  after() {
    return new Date();
  },
  attribute: attribute,
});

module("Date After Validator test");

test("validate", function (assert) {
  assert.deepEqual(
    validator.validate("date", Date.now() + 1000, attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate(
      "date",
      "Mon Aug 17 2025 00:24:56 GMT-0500 (CDT)",
      attribute,
      {}
    ),
    undefined
  );
  assert.deepEqual(
    validator.validate("date", "Tue, 15 Nov 2030 12:45:26 GMT", attribute, {}),
    undefined
  );

  // Should not validate empty values
  assert.deepEqual(validator.validate("date", null, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("date", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("date", false, attribute, {}), undefined);
  assert.deepEqual(validator.validate("date", "", attribute, {}), undefined);
  assert.deepEqual(validator.validate("date", [], attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("date", Date.now() - 10 * 60 * 1000, attribute, {}),
    "Date must be after the set date"
  );
  assert.deepEqual(
    validator.validate(
      "date",
      "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)",
      attribute,
      {}
    ),
    "Date must be after the set date"
  );
  assert.deepEqual(
    validator.validate("date", "Tue, 15 Nov 2000 12:45:26 GMT", attribute, {}),
    "Date must be after the set date"
  );
});
