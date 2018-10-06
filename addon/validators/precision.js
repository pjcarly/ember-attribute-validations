import Validator from 'ember-attribute-validations/validator';
import { amountOfDigits } from 'ember-attribute-validations/utils';
import { isBlank } from '@ember/utils';

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */
export default Validator.extend({
  validate(name, value, attributes) {
    if (!isBlank(value) && !isNaN(value) && (amountOfDigits(value) > attributes.options.validation.precision)) {
      return this.format(attributes.options.validation.precision);
    }
  }
});
