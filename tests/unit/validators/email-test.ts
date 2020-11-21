import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/email";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute: AttributeInterface = {
  options: {},
  name: "email",
  type: "email",
  isAttribute: true,
  parentTypeKey: "test",
};

module("Email Validator test", function (hooks) {
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

    assert.equal(
      validator.validate(
        "email",
        "manda.lorian@gmail.com",
        attribute,
        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate(
        "email",
        "manda.loria.n@dev.dom.net",
        attribute,
        <Model>{}
      ),
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
      "ember-attribute-validations.email"
    );
    assert.equal(
      validator.validate("email", "some value", attribute, <Model>{}),
      "ember-attribute-validations.email"
    );
  });
});
