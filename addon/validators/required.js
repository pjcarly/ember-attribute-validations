import Validator from 'ember-attribute-validations/validator';
import {
  hasValue, hasBelongsToValue
}
from 'ember-attribute-validations/utils';
/**
 * Validator that checks if the value is set.
 *
 * @class  RequiredValidator
 * @extends {Validator}
 */
export default Validator.extend({
  validate: function(name, value, attribute) {
    if (attribute.isAttribute) {
      if (!hasValue(value)) {
        return this.format();
      }
    } else if (attribute.isRelationship) {
      if (attribute.kind === 'belongsTo') {
        if (!hasBelongsToValue(value)) {
          return this.format();
        }
      }
    }
  }
});