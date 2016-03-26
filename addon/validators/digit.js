import PatternValidator from 'ember-attribute-validations/pattern-validator';

/**
 * Validator that checks if the Attribute value
 * contains only digits.
 *
 * @class DigitValidator
 * @extends {PatternValidator}
 */
export default PatternValidator.extend({
  pattern: /^\d+$/
});
