import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';
import { getValidationType } from 'ember-attribute-validations/utils';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { classify } from '@ember/string';

const { canInvoke } = Ember;

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

  validate(name, value, attribute) {
    const type = getValidationType(attribute.type);
    const fromValue = this.get('from');
    const toValue = this.get('to');

    assert('You must define a `from` for RangeValidator', isPresent(fromValue));
    assert('You must define a `to` for RangeValidator', isPresent(toValue));

    const validatorName = 'validate' + classify(type);
    let invalid = true;

    if(canInvoke(this, validatorName)) {
      invalid = run(this, validatorName, value, fromValue, toValue);
    }

    if(invalid) {
      return this.format(fromValue, toValue);
    }
  },

  validateString(value, fromValue, toValue) {
    if(typeof value !== 'string') {
      return true;
    }

    const length = value && value.length || 0;

    return length < fromValue || length > toValue;
  },

  validateNumber(value, fromValue, toValue) {
    value = parseInt(value, 10);

    if(isNaN(value)) {
      return true;
    }

    return value < fromValue || value > toValue;
  }
});
