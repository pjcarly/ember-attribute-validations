import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
import { isBoolean } from "@getflights/ember-attribute-validations/utils";

/**
 * Acceptance Validator used to validate boolean like
 * Attributes.
 *
 * @class  AcceptanceValidator
 * @extends {Validator}
 */
export default class AcceptanceValidator extends Validator {
  name = "acceptance";

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
    if (value !== "true" && (!isBoolean(value) || value === false)) {
      return this.format();
    }

    return false;
  }
}
