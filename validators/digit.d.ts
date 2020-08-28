import PatternValidator from "@getflights/ember-attribute-validations/pattern-validator";
/**
 * Validator that checks if the Attribute value
 * contains only digits.
 *
 * @class DigitValidator
 * @extends {PatternValidator}
 */
export default class DigitValidator extends PatternValidator {
  name: string;
  pattern: RegExp;
}
