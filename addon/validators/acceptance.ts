import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { isBoolean } from "@getflights/ember-attribute-validations/utils";

/**
 * Acceptance Validator used to validate boolean like
 * Attributes.
 */
export default class AcceptanceValidator extends BaseValidator {
  name = "acceptance";

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
    if (value !== "true" && (!isBoolean(value) || value === false)) {
      return this.format();
    }

    return false;
  }
}
