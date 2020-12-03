import Model from "@ember-data/model";
import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import { getValidationType } from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";
import { tracked } from "@glimmer/tracking";

export interface RangeValidatorOptions extends ValidatorOptions {
  range: {
    from: number;
    to: number;
  };
}

/**
 * Validator that could be used to validate Strings and Numbers.
 *
 * If the value is a String it's length should be in the defined range.
 * If it is a Number, it's value should be in defined range.
 *
 */
export default class RangeValidator extends BaseValidator<RangeValidatorOptions> {
  name = "range";

  /**
   * Number representing the starting point
   * of the range validation.
   */
  @tracked from: number;

  /**
   * Number representing the ending point
   * of the range validation.
   */
  @tracked to: number;

  constructor(attribute: AttributeInterface, options?: RangeValidatorOptions) {
    super(attribute);
    assert(
      "You must define a `from` for RangeValidator",
      options?.range?.from || options?.range?.from === 0
    );
    assert(
      "You must define a `to` for RangeValidator",
      options?.range?.to || options?.range?.to === 0
    );

    this.from = options.range.from;
    this.to = options.range.to;
  }

  validate(value: any, _2: Model): string | boolean {
    const type = getValidationType(this.attribute.type);

    let invalid = true;

    if (type === "string") {
      invalid = this.validateString(value);
    } else if (type === "number") {
      invalid = this.validateNumber(value);
    }

    if (invalid) {
      return this.format({ start: this.from + "", end: this.to + "" });
    }

    return false;
  }

  validateString(value: string) {
    if (typeof value !== "string") {
      return true;
    }

    const length = (value && value.length) || 0;

    return length < this.from || length > this.to;
  }

  validateNumber(value: string) {
    const testValue = parseInt(value, 10);

    if (isNaN(testValue)) {
      return true;
    }

    return testValue < this.from || testValue > this.to;
  }
}
