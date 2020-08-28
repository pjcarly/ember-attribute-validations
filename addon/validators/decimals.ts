import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
import { decimalPlaces } from "@getflights/ember-attribute-validations/utils";
import { isBlank } from "@ember/utils";

/**
 * Validator that checks if the Attribute value
 * has a max amount of decimals
 *
 * @class DecimalsValidator
 * @extends {Validator}
 */

export default class DecimalsValidator extends Validator {
  name = "decimals";

  validate(
    _: string,
    value: any,
    attributes: any,
    _3: Model
  ): string | boolean {
    if (
      !isBlank(value) &&
      !isNaN(value) &&
      decimalPlaces(value) > attributes.options.validation.decimals
    ) {
      return this.format({ decimals: attributes.options.validation.decimals });
    }

    return false;
  }
}
