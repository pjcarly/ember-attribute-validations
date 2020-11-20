import Model from "@ember-data/model";
import { setOwner } from "@ember/application";
import Service from "@ember/service";
import Validator, {
  uuid as patterns,
} from "@getflights/ember-attribute-validations/validators/uuid";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const attribute = {
  options: {},
  name: "uuid",
};

module("uuid Validator test", function (hooks) {
  setupTest(hooks);

  test("validate all", function (assert) {
    const validator = Validator.create({
      attribute: attribute,
    });
    setOwner(validator, this.owner);

    console.log(validator.pattern);

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

    validate(
      assert,
      validator,
      [
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "A987FBC9-4BED-4078-8F07-9141BA07C9F3",
        "A987FBC9-4BED-5078-AF07-9141BA07C9F3",
      ],
      [
        false,
        "934859",
        "987FBC9-4BED-3078-CF07A-9141BA07C9F3",
        "AAAAAAAA-1111-1111-AAAG-111111111111",
        "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx",
        "A987FBC94BED3078CF079141BA07C9F3",
      ]
    );
  });

  test("validate v3", function (assert) {
    const validator = Validator.create({
      version: "3",
      attribute: attribute,
    });
    validator.set("version", "3");
    validator.set("attribute", attribute);

    validate(
      assert,
      validator,
      ["A987FBC9-4BED-3078-CF07-9141BA07C9F3"],
      [
        false,
        "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "934859",
        "AAAAAAAA-1111-1111-AAAG-111111111111",
        "A987FBC9-4BED-4078-8F07-9141BA07C9F3",
        "A987FBC9-4BED-5078-AF07-9141BA07C9F3",
      ]
    );
  });

  test("validate v4", function (assert) {
    const validator = Validator.create({
      version: "4",
      attribute: attribute,
    });

    validate(
      assert,
      validator,
      [
        "713ae7e3-cb32-45f9-adcb-7c4fa86b90c1",
        "625e63f3-58f5-40b7-83a1-a72ad31acffb",
        "57b73598-8764-4ad0-a76a-679bb6640eb1",
        "9c858901-8a57-4791-81fe-4c455b099bc9",
      ],
      [
        false,
        "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "934859",
        "AAAAAAAA-1111-1111-AAAG-111111111111",
        "A987FBC9-4BED-5078-AF07-9141BA07C9F3",
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3",
      ]
    );
  });

  test("validate v5", function (assert) {
    const validator = Validator.create({
      version: "5",
      attribute: attribute,
    });

    validate(
      assert,
      validator,
      [
        "987FBC97-4BED-5078-AF07-9141BA07C9F3",
        "987FBC97-4BED-5078-BF07-9141BA07C9F3",
        "987FBC97-4BED-5078-8F07-9141BA07C9F3",
        "987FBC97-4BED-5078-9F07-9141BA07C9F3",
      ],
      [
        false,
        "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "934859",
        "AAAAAAAA-1111-1111-AAAG-111111111111",
        "9c858901-8a57-4791-81fe-4c455b099bc9",
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3",
      ]
    );
  });
});

function validate(
  assert: Assert,
  validator: Validator,
  valid: string[],
  invalid: any[]
) {
  assert.expect(0);
  // valid.forEach(function (uuid) {
  //   assert.equal(validator.validate("uuid", uuid, attribute, <Model>{}), false);
  // });
  // invalid.forEach(function (uuid) {
  //   assert.equal(
  //     validator.validate("uuid", uuid, attribute, <Model>{}),
  //     "Uuid must be a valid UUID"
  //   );
  // });
  // // Should not validate empty values
  // assert.equal(
  //   validator.validate("uuid", undefined, attribute, <Model>{}),
  //   false
  // );
  // assert.equal(validator.validate("uuid", null, attribute, <Model>{}), false);
  // assert.equal(validator.validate("uuid", "", attribute, <Model>{}), false);
}
