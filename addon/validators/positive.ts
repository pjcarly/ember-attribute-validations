import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks if the Attribute value is a positive number.
 */

export default class PositiveValidator extends BaseValidator {
  name = "positive";

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
    if (!isBlank(value) && (isNaN(value) || value < 0)) {
      return this.format();
    }

    return false;
  }
}
