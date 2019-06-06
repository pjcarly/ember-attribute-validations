import Validator from 'ember-attribute-validations/validators/number';
import { module, test } from 'qunit';

var attribute = {
  options: {},
  name: 'stars'
};

var validator = Validator.create({
  message: '%@ must be a number',
  attribute: attribute
});

module('Number Validator test');

test('validate', function(assert) {
  assert.deepEqual(validator.validate('stars', '100.000', attribute, {}), undefined);
  assert.deepEqual(validator.validate('stars', 9, attribute, {}), undefined);
  assert.deepEqual(validator.validate('stars', 0, attribute, {}), undefined);
  assert.deepEqual(validator.validate('stars', '12345', attribute, {}), undefined);
  assert.deepEqual(validator.validate('stars', '78.98', attribute, {}), undefined);

  // Should not validate empty values
  assert.deepEqual(validator.validate('url', undefined, attribute, {}), undefined);
  assert.deepEqual(validator.validate('url', null, attribute, {}), undefined);
  assert.deepEqual(validator.validate('url', '', attribute, {}), undefined);

  assert.deepEqual(validator.validate('stars', '78.98,00', attribute, {}), 'Stars must be a number');
  assert.deepEqual(validator.validate('stars', false, attribute, {}), 'Stars must be a number');
  assert.deepEqual(validator.validate('stars', 'some value', attribute, {}), 'Stars must be a number');
});
