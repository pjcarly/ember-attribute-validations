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

    assert.equal(
      validator.validate("url", "http://domain.net", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("url", "http://domain.net.eu", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("url", "http://sub.domain.com", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate(
        "url",
        "https://domain.net/page.html",
        attribute,
        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate("url", "https://domain.net.eu", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("url", "https://sub.domain.com", attribute, <Model>{}),
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
      validator.validate("url", "manda.lorian@gmail.com", attribute, <Model>{}),
      "ember-attribute-validations.url"
    );
    assert.equal(
      validator.validate(
        "url",
        "manda.loria.n@dev.dom.net",
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.url"
    );
    assert.equal(
      validator.validate("url", false, attribute, <Model>{}),
      "ember-attribute-validations.url"
    );
    assert.equal(
      validator.validate("url", "some value", attribute, <Model>{}),
      "ember-attribute-validations.url"
    );
  });
});
