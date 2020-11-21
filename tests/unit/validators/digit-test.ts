import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/digit";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute: AttributeInterface = {
  options: {},
  name: "Digit",
  type: "number",
  parentTypeKey: "test",
  isAttribute: true,
};

module("Digit Validator test", function (hooks) {
  setupTest(hooks);
  test("validate", function (assert) {
    const validator = new Validator(attribute);
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
    assert.equal(validator.validate("digit", 1, attribute, <Model>{}), false);
    assert.equal(validator.validate("digit", 9, attribute, <Model>{}), false);
    assert.equal(
      validator.validate("digit", "12345", attribute, <Model>{}),
      false
    );

    // Should not validate empty values
    assert.equal(
      validator.validate("digit", null, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("digit", undefined, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("digit", "", attribute, <Model>{}), false);

    assert.equal(
      validator.validate("digit", false, attribute, <Model>{}),
      "ember-attribute-validations.digit"
    );
    assert.equal(
      validator.validate("digit", "some value", attribute, <Model>{}),
      "ember-attribute-validations.digit"
    );
  });
});
