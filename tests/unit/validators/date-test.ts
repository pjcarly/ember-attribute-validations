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

    assert.equal(validator.validate(Date.now(), <Model>{}), false);
    assert.equal(validator.validate(new Date(), <Model>{}), false);
    assert.equal(
      validator.validate(
        new Date().toISOString(),

        <Model>{}
      ),
      false
    );
    assert.equal(validator.validate("2/22/23", <Model>{}), false);
    assert.equal(validator.validate("11/2/23 12:24", <Model>{}), false);
    assert.equal(
      validator.validate(
        "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)",

        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate(
        "Tue, 15 Nov 1994 12:45:26 GMT",

        <Model>{}
      ),
      false
    );

    // Should not validate empty values
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);
    assert.equal(validator.validate([], <Model>{}), false);

    assert.equal(
      validator.validate(false, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate(<Model>{}, <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("some value", <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("2011-foo-04", <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("2009367", <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate("2009M511", <Model>{}),
      "ember-attribute-validations.date"
    );
    assert.equal(
      validator.validate(
        "2010-02-18T16,25:23:48,444",

        <Model>{}
      ),
      "ember-attribute-validations.date"
    );
  });
});
