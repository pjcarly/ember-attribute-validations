import Validator from "@getflights/ember-attribute-validations/validator";
import { isBlank } from "@ember/utils";
import Model from "@ember-data/model";

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */

export default class WholeNumberValidator extends Validator {
  name = "wholenumber";

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
    if (!isBlank(value) && (isNaN(value) || value % 1 !== 0)) {
      return this.format();
    }

    return false;
  }
}
