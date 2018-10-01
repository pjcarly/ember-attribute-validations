import Validator from 'ember-attribute-validations/validator';
import { decimalPlaces } from 'ember-attribute-validations/utils';
import { isBlank } from '@ember/utils';

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */

export default Validator.extend({
  validate: function(name, value, attributes) {
    if (!isBlank(value) && !isNaN(value) && (decimalPlaces(value) > attributes.options.validation.decimals)) {
      return this.format(attributes.options.validation.decimals);
    }
  }
});
