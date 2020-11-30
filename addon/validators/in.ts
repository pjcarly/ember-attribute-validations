import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue } from "../utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import { isArray } from "@ember/array";
import { tracked } from "@glimmer/tracking";

export interface InValidatorOptions extends ValidatorOptions {
  in: string[];
}

/**
 * Validator that is used to validate if the
 * value is in range of acceptable values.
 */
export default class InValidator extends BaseValidator<InValidatorOptions> {
  constructor(attribute: AttributeInterface, options?: InValidatorOptions) {
    super(attribute);

    assert("You must define an in validation options", options?.in);
    assert(
      "The in validation options must be an array containing the possible values",
      isArray(options.in)
    );

    this.values = options.in;
  }

  @tracked values: string[];
  name = "in";

  validate(value: any, _model: Model): string | boolean {
    assert(
      "You must define an array of Enum values in order to validate.",
      isPresent(this.values) && isArray(this.values)
    );

    if (hasValue(value) && this.values.indexOf(value) < 0) {
      return this.format({ values: this.values.join(", ") });
    }

    return false;
  }
}
