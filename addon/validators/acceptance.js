import Validator from 'ember-attribute-validations/validator';
import {
  isBoolean
} from 'ember-attribute-validations/utils';

/**
 * Acceptance Validator used to validate boolean like
 * Attributes.
 *
 * @class  AcceptanceValidator
 * @extends {Validator}
 */
export default Validator.extend({
  validate: function(name, value) {
    if (value !== 'true' && (!isBoolean(value) || value === false)) {
      return this.format();
    }
  }
});
