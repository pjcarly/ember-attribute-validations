import BaseValidator, {
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import { isBlank } from "@ember/utils";
import Model from "@ember-data/model";

/**
 * Validator that checks if the Attribute value
 * is a number.
 */
export default class WholeNumberValidator extends BaseValidator<
  ValidatorOptions
> {
  name = "wholenumber";

  validate(value: any, _model: Model): string | boolean {
    if (!isBlank(value) && (isNaN(value) || value % 1 !== 0)) {
      return this.format();
    }

    return false;
  }
}
