import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import Validator from "@getflights/ember-attribute-validations/validators/required";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute = {
  options: {},
  isAttribute: true,
  meta: {
    isRelationship: false,
  },
  name: "check",
};

module("Required Validator test", function (hooks) {
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
      validator.validate("check", true, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("check", "true", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("check", false, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("check", "some value", attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("check", 0, attribute, <Model>{}), false);

    assert.equal(
      validator.validate("check", "", attribute, <Model>{}),
      "ember-attribute-validations.required"
    );
    assert.equal(
      validator.validate("check", null, attribute, <Model>{}),
      "ember-attribute-validations.required"
    );
    assert.equal(
      validator.validate("check", undefined, attribute, <Model>{}),
      "ember-attribute-validations.required"
    );
  });
});
