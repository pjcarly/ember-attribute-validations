// @ts-ignore
import { attr } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | Acceptance", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("boolean", { validation: { acceptance: true } })
      agreed!: boolean;
    };

    this.owner.register("model:dummy", model);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.acceptance`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    const attributes = <Map<string, any>>(<unknown>model.attributes);
    assert.ok(attributes.has("agreed"));
    assert.strictEqual(dummy.constructor, model);
    assert.strictEqual(dummy.agreed, undefined);
    assert.strictEqual(dummy.errors.length, 0);

    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("agreed"));
    assert.deepEqual(dummy.errors.errorsFor("agreed"), [
      {
        attribute: "agreed",
        message: "ember-attribute-validations.acceptance",
      },
    ]);

    dummy.errors.remove("agreed");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.agreed = false;
    assert.notOk(dummy.validate());
    assert.strictEqual(dummy.errors.length, 1);
    assert.ok(dummy.errors.has("agreed"));
    assert.deepEqual(dummy.errors.errorsFor("agreed"), [
      {
        attribute: "agreed",
        message: "ember-attribute-validations.acceptance",
      },
    ]);

    dummy.errors.remove("agreed");
    assert.strictEqual(dummy.errors.length, 0);
    dummy.agreed = true;
    assert.ok(dummy.validate());
    assert.strictEqual(dummy.errors.length, 0);
  });
});
