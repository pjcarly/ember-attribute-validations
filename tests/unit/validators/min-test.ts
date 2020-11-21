import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/min";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Min Validator test", function (hooks) {
  setupTest(hooks);
  test("test missing min value", function (assert) {
    const attribute: AttributeInterface = {
      type: "string",
      options: {},
      name: "email",
      parentTypeKey: "test",
      isAttribute: true,
    };

    // @ts-expect-error
    const validator = new Validator(attribute);

    assert.throws(
      function () {
        validator.validate("email", "value", attribute, <Model>{});
      },
      function (err: any) {
        return (
          err.message ===
          "Assertion Failed: You must define a `min` for MinValidator"
        );
      }
    );
  });

  test("validate string", function (assert) {
    const attribute: AttributeInterface = {
      type: "string",
      options: {},
      name: "email",
      parentTypeKey: "test",
      isAttribute: true,
    };

    const validator = new Validator(attribute, 3);
    setOwner(validator, this.owner);

    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.${validator.name}`;
        }
      }
    );

    assert.equal(
      validator.validate("email", "testing value", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("email", "manda", attribute, <Model>{}),
      false
    );

    assert.equal(
      validator.validate("email", "", attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("email", null, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("email", false, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("email", undefined, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("email", "fo", attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
  });

  test("validate number", function (assert) {
    const attribute: AttributeInterface = {
      type: "number",
      options: {},
      name: "rating",
      parentTypeKey: "test",
      isAttribute: true,
    };

    const validator = new Validator(attribute, 5);
    setOwner(validator, this.owner);

    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.${validator.name}`;
        }
      }
    );

    assert.equal(
      validator.validate("rating", "6", attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("rating", 8, attribute, <Model>{}), false);

    assert.equal(
      validator.validate("rating", 1, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("rating", null, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("rating", false, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("rating", undefined, attribute, <Model>{}),
      "ember-attribute-validations.min"
    );
  });
});
