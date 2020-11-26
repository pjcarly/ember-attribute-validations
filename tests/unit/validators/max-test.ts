import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator, {
  MaxValidatorOptions,
} from "@getflights/ember-attribute-validations/validators/max";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Max Validator test", function (hooks) {
  setupTest(hooks);

  test("test missing max value", function (assert) {
    const attribute: AttributeInterface = {
      type: "string",
      options: {},
      name: "email",
      parentTypeKey: "test",
      isAttribute: true,
    };

    assert.throws(
      function () {
        const validator = new Validator(attribute);
        validator.validate("value", <Model>{});
      },
      function (err: any) {
        return (
          err.message ===
          "Assertion Failed: You must define a `max` for MaxValidator"
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
    const options: MaxValidatorOptions = {
      max: 10,
    };
    const validator = new Validator(attribute, options);
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

    assert.equal(validator.validate("v", <Model>{}), false);
    assert.equal(validator.validate("manda", <Model>{}), false);

    // Should not validate empty values
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);

    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.max"
    );
    assert.equal(
      validator.validate("some email value", <Model>{}),
      "ember-attribute-validations.max"
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

    const options: MaxValidatorOptions = {
      max: 5,
    };

    const validator = new Validator(attribute, options);
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

    assert.equal(validator.validate("3", <Model>{}), false);
    assert.equal(validator.validate(1, <Model>{}), false);

    // Should not validate empty values
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);

    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.max"
    );
    assert.equal(
      validator.validate(6, <Model>{}),
      "ember-attribute-validations.max"
    );
    assert.equal(
      validator.validate(8, <Model>{}),
      "ember-attribute-validations.max"
    );
  });
});
