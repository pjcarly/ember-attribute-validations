import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator, {
  RangeValidatorOptions,
} from "@getflights/ember-attribute-validations/validators/range";
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

    assert.throws(
      function () {
        const validator = new Validator(attribute);
        validator.validate("value", <Model>{});
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

    const options: RangeValidatorOptions = {
      // @ts-expect-error
      range: {
        from: 3,
      },
    };

    assert.throws(
      function () {
        const validator = new Validator(attribute, options);
        validator.validate("value", <Model>{});
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

    const options: RangeValidatorOptions = {
      range: {
        from: 3,
        to: 10,
      },
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

    assert.equal(validator.validate("babyyoda", <Model>{}), false);
    assert.equal(validator.validate("manda", <Model>{}), false);
    assert.equal(validator.validate("some email", <Model>{}), false);

    assert.equal(
      validator.validate("", <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("fo", <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate(null, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate(undefined, <Model>{}),
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

    const options: RangeValidatorOptions = {
      range: {
        from: 3,
        to: 10,
      },
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
    assert.equal(validator.validate("9", <Model>{}), false);
    assert.equal(validator.validate(8, <Model>{}), false);
    assert.equal(validator.validate(4, <Model>{}), false);

    assert.equal(
      validator.validate(11, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate("2", <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate(null, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.range"
    );
    assert.equal(
      validator.validate(undefined, <Model>{}),
      "ember-attribute-validations.range"
    );
  });
});
