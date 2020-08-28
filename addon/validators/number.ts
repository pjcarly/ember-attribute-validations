import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */

export default class NumberValidator extends Validator {
  name = "number";

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
    if (!isBlank(value) && isNaN(value)) {
      return this.format();
    }

    return false;
  }
}
