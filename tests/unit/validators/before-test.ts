import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import { AttributeInterface } from "@getflights/ember-attribute-validations/base-validator";
import Validator from "@getflights/ember-attribute-validations/validators/before";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const currentDate = Date.parse(
  "Fri Nov 20 2020 18:06:21 GMT+0100 (Central European Standard Time)"
);

const attribute: AttributeInterface = {
  options: {
    validation: {
      before() {
        return currentDate;
      },
    },
  },
  name: "Date",
  type: "date",
  parentTypeKey: "test",
  isAttribute: true,
};

module("Date Before Validator test", function (hooks) {
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

    assert.equal(validator.validate(currentDate - 1000, <Model>{}), false);
    assert.equal(
      validator.validate(
        "Mon Aug 17 2001 00:24:56 GMT-0500 (CDT)",

        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate(
        "Tue, 15 Nov 2000 12:45:26 GMT",

        <Model>{}
      ),
      false
    );

    // Should not validate empty values
    assert.equal(validator.validate(null, <Model>{}), false);
    assert.equal(validator.validate(undefined, <Model>{}), false);
    assert.equal(validator.validate(false, <Model>{}), false);
    assert.equal(validator.validate("", <Model>{}), false);
    assert.equal(validator.validate([], <Model>{}), false);

    assert.equal(
      validator.validate(
        currentDate + 10 * 60 * 1000,

        <Model>{}
      ),
      "ember-attribute-validations.beforeDate"
    );
    assert.equal(
      validator.validate("Mon Aug 17 2045 00:24:56 GMT-0500 (CDT)", <Model>{}),
      "ember-attribute-validations.beforeDate"
    );
    assert.equal(
      validator.validate("Tue, 15 Nov 2045 12:45:26 GMT", <Model>{}),
      "ember-attribute-validations.beforeDate"
    );
  });
});
