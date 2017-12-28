import Ember from 'ember';
import Validator from 'ember-attribute-validations/validators/digit';

var attribute = {
  options: {},
  name: 'Digit'
};

var validator = Validator.create({
  message: '%@ must be a digit',
  attribute: attribute
});

module('Digit Validator test');

test('validate', function() {
  deepEqual(validator.validate('digit', 1, attribute, {}), undefined);
  deepEqual(validator.validate('digit', 9, attribute, {}), undefined);
  deepEqual(validator.validate('digit', '12345', attribute, {}), undefined);

  // Should not validate empty values
  deepEqual(validator.validate('digit', null, attribute, {}), undefined);
  deepEqual(validator.validate('digit', undefined, attribute, {}), undefined);
  deepEqual(validator.validate('digit', '', attribute, {}), undefined);

  deepEqual(validator.validate('digit', false, attribute, {}), 'Digit must be a digit');
  deepEqual(validator.validate('digit', 'some value', attribute, {}), 'Digit must be a digit');
});
