import BaseValidator, {
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks if the Attribute value is a positive number.
 */

export default class PositiveValidator extends BaseValidator<ValidatorOptions> {
  name = "positive";

  validate(value: any, _model: Model): string | boolean {
    if (!isBlank(value) && (isNaN(value) || value < 0)) {
      return this.format();
    }

    return false;
  }
}
