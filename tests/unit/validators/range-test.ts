import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/range";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Range Validator test", function (hooks) {
  setupTest(hooks);

  test("test missing from value", function (assert) {
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
          "Assertion Failed: You must define a `from` for RangeValidator"
        );
      }
    );
  });

  test("test missing to value", function (assert) {
    const attribute: AttributeInterface = {
      type: "string",
      options: {},
      name: "email",
      parentTypeKey: "test",
      isAttribute: true,
    };

    // @ts-expect-error
    const validator = new Validator(attribute, 1);

    assert.throws(
      function () {
        validator.validate("email", "value", attribute, <Model>{});
      },
      function (err: any) {
        return (
          err.message ===
          "Assertion Failed: You must define a `to` for RangeValidator"
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

    const validator = new Validator(attribute, 3, 10);
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
      validator.validate("email", "babyyoda", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("email", "manda", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("email", "some email", attribute, <Model>{}),
      false
    );

    assert.equal(
      validator.validate("email", "", attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("email", "fo", attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("email", null, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("email", false, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("email", undefined, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
  });

  test("validate number", function (assert) {
    const attribute: AttributeInterface = {
      type: "number",
      options: {},
      name: "attribute",
      parentTypeKey: "test",
      isAttribute: true,
    };

    const validator = new Validator(attribute, 3, 10);
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
      validator.validate("attribute", "3", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("attribute", "9", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("attribute", 8, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("attribute", 4, attribute, <Model>{}),
      false
    );

    assert.equal(
      validator.validate("attribute", 11, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("attribute", "2", attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("attribute", null, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("attribute", false, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("attribute", undefined, attribute, <Model>{}),
      "ember-attribute-validations.range"
    );
  });
});
