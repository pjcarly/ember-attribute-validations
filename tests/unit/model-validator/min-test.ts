// @ts-ignore
import { attr, belongsTo } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | Min", function (hooks) {
  setupTest(hooks);

  test("validate number", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("number", { validation: { min: 10 } })
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
          return key === `ember-attribute-validations.min`;
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

      dummy.number = -123;
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("number"));

      dummy.number = 9;
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("number"));

      dummy.number = 9.99;
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("number"));

      dummy.number = 10.01;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.number = 123;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.number = 123.456;
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);
    }
  });

  test("validate string", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("string", { validation: { min: 10 } })
      value?: string;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.min`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    {
      const attributes = <Map<string, any>>(<unknown>model.attributes);
      assert.ok(attributes.has("value"));
      assert.strictEqual(dummy.constructor, model);
      assert.strictEqual(dummy.date, undefined);
      assert.strictEqual(dummy.errors.length, 0);

      dummy.value = "l";
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("value"));

      dummy.value = "manda";
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("value"));

      dummy.value = 123.01;
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("value"));

      dummy.value = "mandalorian";
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);

      dummy.value = "babyyodaisthebest";
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);
    }
  });
});
