import BaseValidator, {
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks if the Attribute value is a negative number
 */

export default class NegativeValidator extends BaseValidator<ValidatorOptions> {
  name = "negative";

  validate(value: any, _model: Model): string | boolean {
    if (!isBlank(value) && (isNaN(value) || value > 0)) {
      return this.format();
    }

    return false;
  }
}
