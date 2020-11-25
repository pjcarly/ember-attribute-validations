import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import {
  hasValue,
  getValidationType,
} from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import { tracked } from "@glimmer/tracking";

export interface MaxValidatorOptions extends ValidatorOptions {
  max: number;
}

/**
 * Validator that could be used to validate maximum length,
 * if the attribute is String, or to validate the maximum value
 * if the Attribute is a Number.
 */
export default class MaxValidator extends BaseValidator<MaxValidatorOptions> {
  name = "max";

  /**
   * Max value for the validator.
   *
   */
  @tracked max: number;

  constructor(attribute: AttributeInterface, options?: MaxValidatorOptions) {
    super(attribute);

    assert("You must define a `max` for MaxValidator", isPresent(options?.max));
    this.max = <number>options?.max;
  }

  validate(value: any, _model: Model): string | boolean {
    const type = getValidationType(this.attribute.type);

    if (!hasValue(value)) {
      return false;
    }

    let invalid = true;

    if (type === "string") {
      invalid = this.validateString(value);
    } else if (type === "number") {
      invalid = this.validateNumber(value);
    }

    if (invalid) {
      return this.format({ max: this.max + "" });
    }

    return false;
  }

  validateString(value: string) {
    if (typeof value !== "string") {
      return true;
    }

    const length = (value && value.length) || 0;

    return length > this.max;
  }

  validateNumber(value: string) {
    const testValue = parseInt(value, 10);

    if (isNaN(testValue)) {
      return true;
    }

    return testValue > this.max;
  }
}
