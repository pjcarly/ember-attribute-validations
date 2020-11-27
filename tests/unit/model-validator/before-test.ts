// @ts-ignore
import { attr } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | Date Before", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const beforeDate = new Date(2020, 1, 1, 1, 1, 1, 1);

    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("date", {
        validation: { before: beforeDate },
      })
      date!: Date;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.beforeDate`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    const attributes = <Map<string, any>>(<unknown>model.attributes);
    assert.ok(attributes.has("date"));
    assert.strictEqual(dummy.constructor, model);
    assert.strictEqual(dummy.date, undefined);
    assert.strictEqual(dummy.errors.length, 0);
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);

    dummy.date = new Date(2021, 1, 1, 1, 1, 1);
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("date"));
    assert.deepEqual(dummy.errors.errorsFor("date"), [
      {
        attribute: "date",
        message: "ember-attribute-validations.beforeDate",
      },
    ]);

    dummy.errors.remove("date");
    assert.strictEqual(dummy.errors.length, 0);

    dummy.date = new Date(2020, 1, 1, 1, 1, 1, 1);
    assert.equal(dummy.date.getTime(), beforeDate.getTime());
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
  });

  test("validate function", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("boolean", {
        validation: {
          before() {
            return new Date();
          },
        },
      })
      date!: Date;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.beforeDate`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    const attributes = <Map<string, any>>(<unknown>model.attributes);
    assert.ok(attributes.has("date"));
    assert.strictEqual(dummy.constructor, model);
    assert.strictEqual(dummy.date, undefined);
    assert.strictEqual(dummy.errors.length, 0);
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);

    const date = new Date();
    dummy.date = date.setFullYear(date.getFullYear() + 1);
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("date"));
    assert.deepEqual(dummy.errors.errorsFor("date"), [
      {
        attribute: "date",
        message: "ember-attribute-validations.beforeDate",
      },
    ]);

    dummy.errors.remove("date");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.date = date.setFullYear(date.getFullYear() - 2);
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);
  });
});
