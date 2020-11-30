import PatternValidator, {
  PatternValidatorOptions,
} from "@getflights/ember-attribute-validations/pattern-validator";
import { AttributeInterface } from "../base-validator";

/**
 * Validator that checks if the Attribute value
 * contains only digits.
 */
export default class DigitValidator extends PatternValidator<
  PatternValidatorOptions
> {
  name = "digit";

  constructor(
    attribute: AttributeInterface,
    options?: PatternValidatorOptions
  ) {
    super(attribute, options);
    this.pattern = /^\d+$/;
  }
}
