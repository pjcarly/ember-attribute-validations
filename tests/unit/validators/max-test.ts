import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import Validator from "@getflights/ember-attribute-validations/validators/max";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Max Validator test", function (hooks) {
  setupTest(hooks);

  test("test missing max value", function (assert) {
    const attribute = {
      type: "string",
      options: {},
      name: "email",
    };

    const validator = Validator.create({
      attribute: attribute,
    });

    assert.throws(
      function () {
        validator.validate("email", "value", attribute, <Model>{});
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
    const attribute = {
      type: "string",
      options: {},
      name: "email",
    };

    const validator = Validator.create({
      max: 10,
      attribute: attribute,
    });
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

    assert.equal(validator.validate("email", "v", attribute, <Model>{}), false);
    assert.equal(
      validator.validate("email", "manda", attribute, <Model>{}),
      false
    );

    // Should not validate empty values
    assert.equal(
      validator.validate("email", null, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("email", undefined, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("email", "", attribute, <Model>{}), false);

    assert.equal(
      validator.validate("email", false, attribute, <Model>{}),
      "ember-attribute-validations.max"
    );
    assert.equal(
      validator.validate("email", "some email value", attribute, <Model>{}),
      "ember-attribute-validations.max"
    );
  });

  test("validate number", function (assert) {
    const attribute = {
      type: "number",
      options: {},
      name: "rating",
    };

    const validator = Validator.create({
      max: 5,
      attribute: attribute,
    });
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
      validator.validate("rating", "3", attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("rating", 1, attribute, <Model>{}), false);

    // Should not validate empty values
    assert.equal(
      validator.validate("email", null, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("email", undefined, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("email", "", attribute, <Model>{}), false);

    assert.equal(
      validator.validate("rating", false, attribute, <Model>{}),
      "ember-attribute-validations.max"
    );
    assert.equal(
      validator.validate("rating", 6, attribute, <Model>{}),
      "ember-attribute-validations.max"
    );
    assert.equal(
      validator.validate("rating", 8, attribute, <Model>{}),
      "ember-attribute-validations.max"
    );
  });
});
