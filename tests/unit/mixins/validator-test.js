import EmberObject from "@ember/object";
import ValidatorMixin from "@getflights/ember-attribute-validations/mixins/validator";
import { module, test } from "qunit";

module("Unit | Mixin | validator");

// Replace this with your real tests.
test("it works", function (assert) {
  const ValidatorObject = EmberObject.extend(ValidatorMixin);
  const subject = ValidatorObject.create();
  assert.ok(subject);
});
