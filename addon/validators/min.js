import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';
import {
  isNumeric
}
from 'ember-attribute-validations/utils';

/**
 * Validator that could be used to validate minimum length,
 * if the attribute is String, or to validate the minimum value
 * if the Attribute is a Number.
 *
 * @class  MinValidator
 * @extends {Validator}
 */
export default Validator.extend({
  /**
   * Min value for the validator.
   *
   * @property min
   * @type {Number}
   * @default null
   */
  min: null,

  validate: function(name, value, attribute) {
    let type = attribute.type,
      minValue = this.get('min');

    Ember.assert('You must define a `min` for MinValidator', Ember.isPresent(minValue));

    let invalid = true;

    if (attribute.type === 'string') {
      invalid = this.validateString(value, maxValue);
    } else {
      invalid = this.validateNumber(value, maxValue);
    }

    if (invalid) {
      return this.format(minValue);
    }
  },

  validateString: function(value, min) {
    if (typeof value !== 'string') {
      return true;
    }

    let length = value && value.length || 0;

    return length < min;
  },

  validateNumber: function(value, min) {
    value = parseFloat(value, 10);

    if (isNaN(value)) {
      return true;
    }

    return value < min;
  }
});