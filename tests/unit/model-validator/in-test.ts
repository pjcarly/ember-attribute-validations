// @ts-ignore
import { attr } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | In", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr({ validation: { in: ["baby", "yoda"] } })
      segment!: string[];
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.in`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    const attributes = <Map<string, any>>(<unknown>model.attributes);
    assert.ok(attributes.has("segment"));
    assert.strictEqual(dummy.constructor, model);
    assert.strictEqual(dummy.segment, undefined);
    assert.strictEqual(dummy.errors.length, 0);

    dummy.segment = "babyyoda";
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("segment"));
    assert.deepEqual(dummy.errors.errorsFor("segment"), [
      {
        attribute: "segment",
        message: "ember-attribute-validations.in",
      },
    ]);

    dummy.errors.remove("segment");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.segment = "baby";
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);
    dummy.segment = "yoda";
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);
  });
});
