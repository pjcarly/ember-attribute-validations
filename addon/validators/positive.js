import Validator from 'ember-attribute-validations/validator';
import { isBlank } from '@ember/utils';

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */

export default Validator.extend({
  validate: function(name, value) {
    if (!isBlank(value) && (isNaN(value) || (value < 0))) {
      return this.format();
    }
  }
});
