import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/url";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute: AttributeInterface = {
  options: {},
  name: "url",
  type: "link",
  parentTypeKey: "test",
  isAttribute: true,
};

module("url Validator test", function (hooks) {
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

    assert.equal(validator.validate("http://domain.net", <Model>{}), false);
    assert.equal(validator.validate("http://domain.net.eu", <Model>{}), false);
    assert.equal(validator.validate("http://sub.domain.com", <Model>{}), false);
    assert.equal(
      validator.validate("https://domain.net/page.html", <Model>{}),
      false
    );
    assert.equal(validator.validate("https://domain.net.eu", <Model>{}), false);
    assert.equal(
      validator.validate("https://sub.domain.com", <Model>{}),
      false
    );

    // Should not validate empty values
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);

    assert.equal(
      validator.validate("manda.lorian@gmail.com", <Model>{}),
      "ember-attribute-validations.url"
    );
    assert.equal(
      validator.validate("manda.loria.n@dev.dom.net", <Model>{}),
      "ember-attribute-validations.url"
    );
    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.url"
    );
    assert.equal(
      validator.validate("some value", <Model>{}),
      "ember-attribute-validations.url"
    );
  });
});
