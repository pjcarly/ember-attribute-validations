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
  validate(name, value) {

    if (!isBlank(value) && (isNaN(value) || (value % 1 !== 0))) {
      return this.format();
    }
  }
});
