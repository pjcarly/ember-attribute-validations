import EmberObject from "@ember/object";
import ValidatorMixin from "@getflights/ember-attribute-validations/mixins/validator";
import { module, test } from "qunit";

module("Unit | Mixin | validator");

// Replace this with your real tests.
test("it works", function (assert) {
  var ValidatorObject = EmberObject.extend(ValidatorMixin);
  var subject = ValidatorObject.create();
  assert.ok(subject);
});
