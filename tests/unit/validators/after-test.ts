import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import Validator from "@getflights/ember-attribute-validations/validators/after";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const currentDate = Date.parse(
  "Fri Nov 20 2020 18:06:21 GMT+0100 (Central European Standard Time)"
);
const attribute = {
  options: {
    validation: {
      after: currentDate,
    },
  },
  name: "Date",
};

module("Date After Validator test", function (hooks) {
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
      validator.validate("date", currentDate + 1000, attribute, <Model>{}),
      false
    );
    assert.equal(
      validator.validate(
        "date",
        "Mon Aug 17 2025 00:24:56 GMT-0500 (CDT)",
        attribute,
        <Model>{}
      ),
      false
    );
    assert.equal(
      validator.validate(
        "date",
        "Tue, 15 Nov 2030 12:45:26 GMT",
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
    assert.equal(
      validator.validate("date", false, attribute, <Model>{}),
      false
    );
    assert.equal(validator.validate("date", "", attribute, <Model>{}), false);
    assert.equal(validator.validate("date", [], attribute, <Model>{}), false);

    assert.equal(
      validator.validate(
        "date",
        currentDate - 10 * 60 * 1000,
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.afterDate"
    );
    assert.equal(
      validator.validate(
        "date",
        "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)",
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.afterDate"
    );
    assert.equal(
      validator.validate(
        "date",
        "Tue, 15 Nov 2000 12:45:26 GMT",
        attribute,
        <Model>{}
      ),
      "ember-attribute-validations.afterDate"
    );
  });
});
