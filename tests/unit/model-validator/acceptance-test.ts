// @ts-ignore
import { attr, belongsTo } from "@ember-data/model";
import Store from "@ember-data/store";
import Service from "@ember/service";
import ValidationModel from "@getflights/ember-attribute-validations/model/validation-model";
import ValidatorService from "@getflights/ember-attribute-validations/services/validator";
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
          return key === `ember-attribute-validations.acceptance` || key === `ember-attribute-validations.required`;
        }
      }
    );

    const childModel = class DummyChildModel extends ValidationModel {
      // @ts-ignore
      @attr("string", { validation: { required: true } })
      name!: string;

      // @ts-ignore
      @belongsTo("dummy", { validation: { required: true } })
      parent !: ValidationModel;
    }

    this.owner.register("model:child", childModel);

    const store = this.owner.lookup("service:store") as Store;
    const dummy = store.createRecord("dummy");

    const attributes = (<unknown>model.attributes) as Map<string, any>;
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

    const validator = this.owner.lookup("service:validator") as ValidatorService;

    const child = store.createRecord("child");
    assert.strictEqual(child.errors.length, 0);

    let result = validator.validateModel(child);
    assert.strictEqual(result, false);
    assert.strictEqual(child.errors.length, 2);

    child.errors.clear();
    assert.strictEqual(child.errors.length, 0);

    result = validator.validateField(child, 'name');
    assert.strictEqual(result, false);
    assert.strictEqual(child.errors.length, 1);
    assert.strictEqual(child.errors.errorsFor('name').length, 1, 'Has error for name solo');

    child.errors.clear();
    assert.strictEqual(child.errors.length, 0);

    result = validator.validateField(child, 'parent');
    assert.strictEqual(result, false);
    assert.strictEqual(child.errors.length, 1);
    assert.strictEqual(child.errors.errorsFor('parent').length, 1, 'Has error for parent solo');

    child.errors.clear();
    assert.strictEqual(child.errors.length, 0);

    result = validator.validateFields(child, ['name', 'parent']);
    assert.strictEqual(result, false);
    assert.strictEqual(child.errors.has('name'), true, 'Name error is found');
    assert.strictEqual(child.errors.has('parent'), true, 'Parent error is found');
    assert.strictEqual(child.errors.length, 2);

    child.parent = dummy;
    result = validator.validateFields(child, ['name', 'parent']);
    assert.strictEqual(result, false);
    assert.strictEqual(child.errors.has('name'), true, 'Name error is found');
    assert.strictEqual(child.errors.has('parent'), false, 'Parent error is not found');
    assert.strictEqual(child.errors.length, 1);

    child.parent = null;
    child.name = 'Karel';
    result = validator.validateFields(child, ['name', 'parent']);
    assert.strictEqual(result, false);
    assert.strictEqual(child.errors.has('name'), false, 'Name error is not found');
    assert.strictEqual(child.errors.has('parent'), true, 'Parent error is found');
    assert.strictEqual(child.errors.length, 1);
  });
});
