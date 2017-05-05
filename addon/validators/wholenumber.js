import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';

const { isBlank } = Ember;

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */

export default Validator.extend({
  validate: function(name, value) {

    if (!isBlank(value) && (isNaN(value) || (value % 1 !== 0))) {
      return this.format();
    }
  }
});
