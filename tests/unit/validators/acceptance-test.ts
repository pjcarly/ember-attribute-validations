import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import Validator from "@getflights/ember-attribute-validations/validators/acceptance";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute = {
  options: {},
  name: "check",
};

module("Acceptance Validator test", function (hooks) {
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
      validator.validate("check", null, attribute, <Model>{}),
      "ember-attribute-validations.acceptance"
    );
    assert.equal(
      validator.validate("check", false, attribute, <Model>{}),
      "ember-attribute-validations.acceptance"
    );
    assert.equal(
      validator.validate("check", undefined, attribute, <Model>{}),
      "ember-attribute-validations.acceptance"
    );
    assert.equal(
      validator.validate("check", "some value", attribute, <Model>{}),
      "ember-attribute-validations.acceptance"
    );
  });
});
