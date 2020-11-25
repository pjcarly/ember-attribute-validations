import PatternValidator from "@getflights/ember-attribute-validations/pattern-validator";
import { ValidatorOptions } from "../base-validator";

/**
 * Validator that checks if the Attribute value
 * contains only digits.
 */
export default class DigitValidator extends PatternValidator<ValidatorOptions> {
  name = "digit";
  pattern = /^\d+$/;
}
