import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import Validator from "@getflights/ember-attribute-validations/validators/number";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute = {
  options: {},
  name: "stars",
};

module("Number Validator test", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const validator = Validator.create({
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
      validator.validate("stars", "100.000", attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("stars", 9, attribute, <Model>{}), false);
    assert.equal(validator.validate("stars", 0, attribute, <Model>{}), false);
    assert.equal(
      validator.validate("stars", "12345", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("stars", "78.98", attribute, <Model>{}),
      false
    );

    // Should not validate empty values
    assert.equal(
      validator.validate("url", undefined, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("url", null, attribute, <Model>{}), false);
    assert.equal(validator.validate("url", "", attribute, <Model>{}), false);

    assert.equal(
      validator.validate("stars", "78.98,00", attribute, <Model>{}),
      "ember-attribute-validations.number"
    );
    assert.equal(
      validator.validate("stars", false, attribute, <Model>{}),
      "ember-attribute-validations.number"
    );
    assert.equal(
      validator.validate("stars", true, attribute, <Model>{}),
      "ember-attribute-validations.number"
    );
    assert.equal(
      validator.validate("stars", "some value", attribute, <Model>{}),
      "ember-attribute-validations.number"
    );
  });
});
