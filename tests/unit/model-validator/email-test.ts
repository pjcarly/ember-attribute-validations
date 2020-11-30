// @ts-ignore
import { attr } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | Email", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("string", { validation: { email: true } })
      email!: string;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.email`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    const attributes = <Map<string, any>>(<unknown>model.attributes);
    assert.ok(attributes.has("email"));
    assert.strictEqual(dummy.constructor, model);
    assert.strictEqual(dummy.email, undefined);
    assert.strictEqual(dummy.errors.length, 0);

    dummy.email = "baby@yoda";
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("email"));
    assert.deepEqual(dummy.errors.errorsFor("email"), [
      {
        attribute: "email",
        message: "ember-attribute-validations.email",
      },
    ]);

    dummy.errors.remove("email");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.email = "baby@yoda.sw";
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);
  });
});
