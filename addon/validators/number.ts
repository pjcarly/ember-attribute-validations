import BaseValidator, {
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { isBlank } from "@ember/utils";
import { isNumeric } from "../utils";

/**
 * Validator that checks if the Attribute value
 * is a number.
 */

export default class NumberValidator extends BaseValidator<ValidatorOptions> {
  name = "number";

  validate(value: any, _model: Model): string | boolean {
    if (!isBlank(value) && (!isNumeric(value) || isNaN(value))) {
      return this.format();
    }

    return false;
  }
}
