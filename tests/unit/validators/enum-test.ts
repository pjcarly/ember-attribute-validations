import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/in";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute: AttributeInterface = {
  options: {},
  name: "enum",
  type: "any",
  parentTypeKey: "test",
  isAttribute: true,
};

module("enum Validator test", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const validator = new Validator(attribute, ["foo", "bar"]);
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
      validator.validate("enum", "foo", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("enum", "bar", attribute, <Model>{}),
      false
    );

    // Should not validate empty values
    assert.equal(
      validator.validate("enum", undefined, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("enum", null, attribute, <Model>{}), false);
    assert.equal(validator.validate("enum", "", attribute, <Model>{}), false);

    assert.equal(
      validator.validate(
        "enum",
        "manda.lorian@gmail.com",
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.in"
    );
    assert.equal(
      validator.validate(
        "enum",
        "manda.loria.n@dev.dom.net",
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.in"
    );
    assert.equal(
      validator.validate("enum", false, attribute, <Model>{}),
      "ember-attribute-validations.in"
    );
    assert.equal(
      validator.validate("enum", "some value", attribute, <Model>{}),
      "ember-attribute-validations.in"
    );
  });
});
