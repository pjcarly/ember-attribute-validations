import PatternValidator from "@getflights/ember-attribute-validations/pattern-validator";

/**
 * Validator that checks if the Attribute value
 * contains only digits.
 */
export default class DigitValidator extends PatternValidator {
  name = "digit";
  pattern = /^\d+$/;
}
