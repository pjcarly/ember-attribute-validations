import BaseValidator, {
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { isBoolean } from "@getflights/ember-attribute-validations/utils";

/**
 * Acceptance Validator used to validate boolean like
 * Attributes.
 */
export default class AcceptanceValidator extends BaseValidator<
  ValidatorOptions
> {
  name = "acceptance";

  validate(value: any, _model: Model): string | boolean {
    if (value !== "true" && (!isBoolean(value) || value === false)) {
      return this.format();
    }

    return false;
  }
}
