import Ember from 'ember';
import ValidatorMixin from 'ember-attribute-validations/mixins/validator';
import { module, test } from 'qunit';

module('Unit | Mixin | validator');

// Replace this with your real tests.
const { Object } = Ember;

test('it works', function(assert) {
  var ValidatorObject = Object.extend(ValidatorMixin);
  var subject = ValidatorObject.create();
  assert.ok(subject);
});
