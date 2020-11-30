// @ts-ignore
import { attr, belongsTo } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Model | Required", function (hooks) {
  setupTest(hooks);

  test("validate", function (assert) {
    const model = class DummyModel extends ValidationModel {
      // @ts-ignore
      @attr("string", { validation: { required: true } })
      name!: string;
    };

    const model2 = class Dummy2Model extends ValidationModel {
      // @ts-ignore
      @belongsTo("dummy", { validation: { required: true }, async: false })
      parent!: ValidationModel;
    };

    this.owner.register("model:dummy", model);
    this.owner.register("model:dummy2", model2);
    this.owner.register(
      "service:intl",
      class IntlMockService extends Service {
        t(key: string, _: { [key: string]: string }): string {
          return key;
        }

        exists(key: string): boolean {
          return key === `ember-attribute-validations.required`;
        }
      }
    );

    const store = <Store>this.owner.lookup("service:store");
    const dummy = store.createRecord("dummy");

    {
      const attributes = <Map<string, any>>(<unknown>model.attributes);
      assert.ok(attributes.has("name"));
      assert.strictEqual(dummy.constructor, model);
      assert.strictEqual(dummy.name, undefined);
      assert.strictEqual(dummy.errors.length, 0);

      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("name"));
      assert.deepEqual(dummy.errors.errorsFor("name"), [
        {
          attribute: "name",
          message: "ember-attribute-validations.required",
        },
      ]);

      dummy.errors.remove("name");
      assert.strictEqual(dummy.errors.length, 0);
      dummy.name = "";
      assert.notOk(dummy.validate());
      assert.strictEqual(dummy.errors.length, 1);
      assert.ok(dummy.errors.has("name"));
      assert.deepEqual(dummy.errors.errorsFor("name"), [
        {
          attribute: "name",
          message: "ember-attribute-validations.required",
        },
      ]);

      dummy.errors.remove("name");
      assert.strictEqual(dummy.errors.length, 0);
      dummy.name = "Dummy";
      assert.ok(dummy.validate());
      assert.strictEqual(dummy.errors.length, 0);
      dummy.id = 3;
    }

    const dummy2 = store.createRecord("dummy2");
    {
      const attributes = <Map<string, any>>(<unknown>model2.attributes);
      const relationships = <Map<string, any>>(<unknown>model2.relationships);

      assert.notOk(attributes.has("name"));
      assert.notOk(attributes.has("dummy"));
      assert.ok(relationships.has("dummy"));
      assert.strictEqual(dummy2.constructor, model2);
      assert.strictEqual(dummy2.parent, null);
      assert.strictEqual(dummy2.errors.length, 0);

      assert.notOk(dummy2.validate());
      assert.strictEqual(dummy2.errors.length, 1);
      assert.ok(dummy2.errors.has("parent"));
      assert.deepEqual(dummy2.errors.errorsFor("parent"), [
        {
          attribute: "parent",
          message: "ember-attribute-validations.required",
        },
      ]);

      dummy2.errors.remove("parent");
      assert.strictEqual(dummy2.errors.length, 0);
      dummy2.parent = "";
      assert.notOk(dummy2.validate());
      assert.strictEqual(dummy2.errors.length, 1);
      assert.ok(dummy2.errors.has("parent"));
      assert.deepEqual(dummy2.errors.errorsFor("parent"), [
        {
          attribute: "parent",
          message: "ember-attribute-validations.required",
        },
      ]);

      dummy2.errors.remove("parent");
      assert.strictEqual(dummy2.errors.length, 0);
      dummy2.parent = dummy;
      assert.ok(dummy2.validate());
      assert.strictEqual(dummy2.errors.length, 0);
    }
  });
});
