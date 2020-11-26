import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator, {
  MinValidatorOptions,
} from "@getflights/ember-attribute-validations/validators/min";
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

    const validator = new Validator(attribute);

    assert.throws(
      function () {
        validator.validate("value", <Model>{});
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

    const options: MinValidatorOptions = {
      min: 3,
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

    assert.equal(validator.validate("testing value", <Model>{}), false);
    assert.equal(validator.validate("manda", <Model>{}), false);

    assert.equal(
      validator.validate("", <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate(null, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate(undefined, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate("fo", <Model>{}),
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
    const options: MinValidatorOptions = {
      min: 5,
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

    assert.equal(validator.validate("6", <Model>{}), false);
    assert.equal(validator.validate(8, <Model>{}), false);

    assert.equal(
      validator.validate(1, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate(null, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.min"
    );
    assert.equal(
      validator.validate(undefined, <Model>{}),
      "ember-attribute-validations.min"
    );
  });
});
