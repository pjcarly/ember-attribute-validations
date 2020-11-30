import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { amountOfDigits } from "@getflights/ember-attribute-validations/utils";
import { isBlank } from "@ember/utils";
import { assert } from "@ember/debug";
import { tracked } from "@glimmer/tracking";

export interface PrecisionValidatorOptions extends ValidatorOptions {
  precision: number;
}

/**
 * Validator that checks the precision of a number
 */
export default class PrecisionValidator extends BaseValidator<
  PrecisionValidatorOptions
> {
  name = "precision";

  @tracked precision: number;

  constructor(
    attribute: AttributeInterface,
    options?: PrecisionValidatorOptions
  ) {
    super(attribute, options);

    assert(
      "You must define a `precision` for PrecisionValidator",
      options?.precision
    );
    this.precision = options.precision;
  }

  validate(value: any, _model: Model): string | boolean {
    if (
      !isBlank(value) &&
      !isNaN(value) &&
      amountOfDigits(value) > this.precision
    ) {
      return this.format({ digits: this.precision });
    }

    return false;
  }
}
