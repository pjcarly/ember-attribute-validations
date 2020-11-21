import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { amountOfDigits } from "@getflights/ember-attribute-validations/utils";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks the precision of a number
 */
export default class PrecisionValidator extends BaseValidator {
  name = "precision";

  validate(
    _: string,
    value: any,
    attributes: any,
    _3: Model
  ): string | boolean {
    if (
      !isBlank(value) &&
      !isNaN(value) &&
      amountOfDigits(value) > attributes.options.validation.precision
    ) {
      return this.format({ digits: attributes.options.validation.precision });
    }

    return false;
  }
}
