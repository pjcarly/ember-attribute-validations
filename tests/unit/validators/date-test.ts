import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/date";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute: AttributeInterface = {
  options: {},
  name: "Date",
  type: "date",
  parentTypeKey: "test",
  isAttribute: true,
};

module("Date Validator test", function (hooks) {
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
      validator.validate("date", Date.now(), attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("date", new Date(), attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate(
        "date",
        new Date().toISOString(),
        attribute,
        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate("date", "2/22/23", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate("date", "11/2/23 12:24", attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate(
        "date",
        "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)",
        attribute,
        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate(
        "date",
        "Tue, 15 Nov 1994 12:45:26 GMT",
        attribute,
        <Model>{}
      ),
      false
    );

    // Should not validate empty values
    assert.equal(validator.validate("date", null, attribute, <Model>{}), false);
    assert.equal(
      validator.validate("date", undefined, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("date", "", attribute, <Model>{}), false);
    assert.equal(validator.validate("date", [], attribute, <Model>{}), false);

    assert.equal(
      validator.validate("date", false, attribute, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("date", <Model>{}, attribute, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("date", "some value", attribute, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("date", "2011-foo-04", attribute, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("date", "2009367", attribute, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("date", "2009M511", attribute, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate(
        "date",
        "2010-02-18T16,25:23:48,444",
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.date"
    );
  });
});
