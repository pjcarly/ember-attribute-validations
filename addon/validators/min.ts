import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import { getValidationType } from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import Model from "@ember-data/model";
import { tracked } from "@glimmer/tracking";

export interface MinValidatorOptions extends ValidatorOptions {
  min: number;
}

/**
 * Validator that could be used to validate minimum length,
 * if the attribute is String, or to validate the minimum value
 * if the Attribute is a Number.
 */
export default class MinValidator extends BaseValidator<MinValidatorOptions> {
  name = "min";

  /**
   * Min value for the validator.
   */
  @tracked min: number;

  constructor(attribute: AttributeInterface, options?: MinValidatorOptions) {
    super(attribute);
    assert("You must define a `min` for MinValidator", isPresent(options?.min));
    this.min = <number>options?.min;
  }

  validate(value: any, _model: Model): string | boolean {
    const type = getValidationType(this.attribute.type);
    let invalid = true;

    if (type === "string") {
      invalid = this.validateString(value);
    } else if (type === "number") {
      invalid = this.validateNumber(value);
    }

    if (invalid) {
      return this.format({ min: this.min + "" });
    }

    return false;
  }

  validateString(value: string) {
    if (typeof value !== "string") {
      return true;
    }

    const length = (value && value.length) || 0;

    return length < this.min;
  }

  validateNumber(value: string) {
    const testValue = parseFloat(value);

    if (isNaN(testValue)) {
      return true;
    }

    return testValue < this.min;
  }
}
