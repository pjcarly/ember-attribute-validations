import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
import { amountOfDigits } from "@getflights/ember-attribute-validations/utils";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks the precision of a number
 *
 * @class PrecisionValidator
 * @extends {Validator}
 */
export default class PrecisionValidator extends Validator {
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
