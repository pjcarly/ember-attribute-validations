import Validator from "@getflights/ember-attribute-validation/validators/date";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "Date",
};

var validator = Validator.create({
  message: "%@ must be a date",
  attribute: attribute,
});

module("Date Validator test");

test("validate", function (assert) {
  assert.deepEqual(
    validator.validate("date", Date.now(), attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("date", new Date(), attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("date", new Date().toISOString(), attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("date", "2/22/23", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("date", "11/2/23 12:24", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate(
      "date",
      "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)",
      attribute,
      {}
    ),
    undefined
  );
  assert.deepEqual(
    validator.validate("date", "Tue, 15 Nov 1994 12:45:26 GMT", attribute, {}),
    undefined
  );

  // Should not validate empty values
  assert.deepEqual(validator.validate("date", null, attribute, {}), undefined);
  assert.deepEqual(
    validator.validate("date", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("date", "", attribute, {}), undefined);
  assert.deepEqual(validator.validate("date", [], attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("date", false, attribute, {}),
    "Date must be a date"
  );
  assert.deepEqual(
    validator.validate("date", {}, attribute, {}),
    "Date must be a date"
  );
  assert.deepEqual(
    validator.validate("date", "some value", attribute, {}),
    "Date must be a date"
  );
  assert.deepEqual(
    validator.validate("date", "2011-foo-04", attribute, {}),
    "Date must be a date"
  );
  assert.deepEqual(
    validator.validate("date", "2009367", attribute, {}),
    "Date must be a date"
  );
  assert.deepEqual(
    validator.validate("date", "2009M511", attribute, {}),
    "Date must be a date"
  );
  assert.deepEqual(
    validator.validate("date", "2010-02-18T16,25:23:48,444", attribute, {}),
    "Date must be a date"
  );
});
