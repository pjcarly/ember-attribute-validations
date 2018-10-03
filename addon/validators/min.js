import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';
import { getValidationType } from 'ember-attribute-validations/utils';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { classify } from '@ember/string';

const { canInvoke } = Ember;

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
    const type = getValidationType(attribute.type);
    const minValue = this.get('min');

    assert('You must define a `min` for MinValidator', isPresent(minValue));

    const validatorName = 'validate' + classify(type);
    let invalid = true;

    if(canInvoke(this, validatorName)) {
      invalid = run(this, validatorName, value, minValue);
    }

    if(invalid) {
      return this.format(minValue);
    }
  },

  validateString: function(value, min) {
    if(typeof value !== 'string') {
      return true;
    }

    var length = value && value.length || 0;

    return length < min;
  },

  validateNumber: function(value, min) {
    value = parseInt(value, 10);

    if(isNaN(value)) {
      return true;
    }

    return value < min;
  }
});
