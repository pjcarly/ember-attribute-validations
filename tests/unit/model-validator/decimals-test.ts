// @ts-ignore
import { attr, belongsTo } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | Decimals", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("number", { validation: { decimals: 2 } })
      number?: number;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.decimals`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    {
      const attributes = <Map<string, any>>(<unknown>model.attributes);
      assert.ok(attributes.has("number"));
      assert.strictEqual(dummy.constructor, model);
      assert.strictEqual(dummy.date, undefined);
      assert.strictEqual(dummy.errors.length, 0);

      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.number = 123.456;
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("number"));

      dummy.number = -123.456;
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("number"));

      dummy.number = -123.45;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.number = 123.45;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.number = -123;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.number = 123;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);
    }
  });
});
