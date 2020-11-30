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
    assert.equal(validator.validate(1, <Model>{}), false);
    assert.equal(validator.validate(9, <Model>{}), false);
    assert.equal(validator.validate("12345", <Model>{}), false);

    // Should not validate empty values
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);

    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.digit"
    );
    assert.equal(
      validator.validate("some value", <Model>{}),
      "ember-attribute-validations.digit"
    );
  });
});
