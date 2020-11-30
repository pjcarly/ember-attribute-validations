// @ts-ignore
import { attr } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | URL", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("string", { validation: { url: true } })
      url!: string;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.url`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    const attributes = <Map<string, any>>(<unknown>model.attributes);
    assert.ok(attributes.has("url"));
    assert.strictEqual(dummy.constructor, model);
    assert.strictEqual(dummy.url, undefined);
    assert.strictEqual(dummy.errors.length, 0);

    dummy.url = "baby.yo.da";
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("url"));
    assert.deepEqual(dummy.errors.errorsFor("url"), [
      {
        attribute: "url",
        message: "ember-attribute-validations.url",
      },
    ]);

    dummy.url = "www.baby.yo.da";
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("url"));
    assert.deepEqual(dummy.errors.errorsFor("url"), [
      {
        attribute: "url",
        message: "ember-attribute-validations.url",
      },
    ]);

    dummy.errors.remove("url");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.url = "http://baby.yo.da";
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);

    dummy.errors.remove("url");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.url = "http://www.baby.yo.da";
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);
  });
});
