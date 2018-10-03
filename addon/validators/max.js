import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';
import { hasValue, getValidationType } from 'ember-attribute-validations/utils';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { classify } from '@ember/string';

const { canInvoke } = Ember;

/**
 * Validator that could be used to validate maximum length,
 * if the attribute is String, or to validate the maximum value
 * if the Attribute is a Number.
 *
 * @class  MaxValidator
 * @extends {Validator}
 */
export default Validator.extend({

  /**
   * Max value for the validator.
   *
   * @property max
   * @type {Number}
   * @default null
   */
  max: null,

  validate: function(name, value, attribute) {
    const type = getValidationType(attribute.type);
    const maxValue = this.get('max');

    assert('You must define a `max` for MaxValidator', isPresent(maxValue));

    if(!hasValue(value)) {
      return;
    }

    const validatorName = 'validate' + classify(type);
    let invalid = true;

    if(canInvoke(this, validatorName)) {
      invalid = run(this, validatorName, value, maxValue);
    }

    if(invalid) {
      return this.format(maxValue);
    }
  },

  validateString: function(value, max) {
    if(typeof value !== 'string') {
      return true;
    }

    const length = value && value.length || 0;

    return length > max;
  },

  validateNumber: function(value, max) {
    value = parseInt(value, 10);

    if(isNaN(value)) {
      return true;
    }

    return value > max;
  }
});
