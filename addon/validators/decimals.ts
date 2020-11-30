import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { decimalPlaces } from "@getflights/ember-attribute-validations/utils";
import { isBlank } from "@ember/utils";
import { assert } from "@ember/debug";

export interface DecimalsValidatorOptions extends ValidatorOptions {
  decimals: number;
}

/**
 * Validator that checks if the Attribute value
 * has a max amount of decimals
 */
export default class DecimalsValidator extends BaseValidator<
  DecimalsValidatorOptions
> {
  name = "decimals";

  decimals: number;

  constructor(
    attribute: AttributeInterface,
    options?: DecimalsValidatorOptions
  ) {
    super(attribute, options);

    assert(
      "You must define an decimals number in the validation attributes",
      options?.decimals
    );
    this.decimals = options.decimals;
  }

  validate(value: any, _model: Model): string | boolean {
    if (
      !isBlank(value) &&
      !isNaN(value) &&
      decimalPlaces(value) > this.decimals
    ) {
      return this.format({ decimals: this.decimals });
    }

    return false;
  }
}
