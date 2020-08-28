import Validator from "@getflights/ember-attribute-validations/validators/url";
import { module, test } from "qunit";

var attribute = {
  options: {},
  name: "url",
};

var validator = Validator.create({
  message: "%@ must be a valid URL",
  attribute: attribute,
});

module("url Validator test");

test("validate", function (assert) {
  assert.deepEqual(
    validator.validate("url", "http://domain.net", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("url", "http://domain.net.eu", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("url", "http://sub.domain.com", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("url", "https://domain.net/page.html", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("url", "https://domain.net.eu", attribute, {}),
    undefined
  );
  assert.deepEqual(
    validator.validate("url", "https://sub.domain.com", attribute, {}),
    undefined
  );

  // Should not validate empty values
  assert.deepEqual(
    validator.validate("url", undefined, attribute, {}),
    undefined
  );
  assert.deepEqual(validator.validate("url", null, attribute, {}), undefined);
  assert.deepEqual(validator.validate("url", "", attribute, {}), undefined);

  assert.deepEqual(
    validator.validate("url", "vlada.spasic@gmail.com", attribute, {}),
    "Url must be a valid URL"
  );
  assert.deepEqual(
    validator.validate("url", "vlada.1234.e@dev.dom.net", attribute, {}),
    "Url must be a valid URL"
  );
  assert.deepEqual(
    validator.validate("url", false, attribute, {}),
    "Url must be a valid URL"
  );
  assert.deepEqual(
    validator.validate("url", "some value", attribute, {}),
    "Url must be a valid URL"
  );
});
