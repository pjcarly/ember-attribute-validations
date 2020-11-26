import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator, {
  InValidatorOptions,
} from "@getflights/ember-attribute-validations/validators/in";
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
    const options: InValidatorOptions = {
      in: ["foo", "bar"],
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
    assert.equal(validator.validate("foo", <Model>{}), false);
    assert.equal(validator.validate("bar", <Model>{}), false);

    // Should not validate empty values
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);

    assert.equal(
      validator.validate(
        "manda.lorian@gmail.com",

        <Model>{}
      ),
      "ember-attribute-validations.in"
    );
    assert.equal(
      validator.validate(
        "manda.loria.n@dev.dom.net",

        <Model>{}
      ),
      "ember-attribute-validations.in"
    );
    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.in"
    );
    assert.equal(
      validator.validate("some value", <Model>{}),
      "ember-attribute-validations.in"
    );
  });
});
