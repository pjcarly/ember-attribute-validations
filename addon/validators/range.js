import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';

/**
 * Validator that could be used to validate Strings and Numbers.
 *
 * If the value is a String it's length should be in the defined range.
 * If it is a Number, it's value should be in defined range.
 *
 * @class  RangeValidator
 * @extends {Validator}
 */
export default Validator.extend({
  /**
   * Number representing the starting point
   * of the range validation.
   *
   * @property from
   * @type {Number}
   * @default null
   */
  from: null,

  /**
   * Number representing the ending point
   * of the range validation.
   *
   * @property to
   * @type {Number}
   * @default null
   */
  to: null,

  validate: function(name, value, attribute) {
    let fromValue = this.get('from'),
      toValue = this.get('to');

    Ember.assert('You must define a `from` for RangeValidator', Ember.isPresent(fromValue));
    Ember.assert('You must define a `to` for RangeValidator', Ember.isPresent(toValue));

    let invalid = true;

    if (attribute.type === 'string') {
      invalid = this.validateString(value, fromValue, toValue);
    } else {
      invalid = this.validateNumber(value, fromValue, toValue);
    }

    if (invalid) {
      return this.format(fromValue, toValue);
    }
  },

  validateString: function(value, fromValue, toValue) {
    if (typeof value !== 'string') {
      return true;
    }

    let length = value && value.length || 0;

    return length < fromValue || length > toValue;
  },

  validateNumber: function(value, fromValue, toValue) {
    value = parseFloat(value, 10);

    if (isNaN(value)) {
      return true;
    }

    return value < fromValue || value > toValue;
  }
});
