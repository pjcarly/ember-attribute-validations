import BaseValidator, {
  AttributeInterface,
} from "@getflights/ember-attribute-validations/base-validator";
import { getValidationType } from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import Model from "@ember-data/model";
import { tracked } from "@glimmer/tracking";

/**
 * Validator that could be used to validate minimum length,
 * if the attribute is String, or to validate the minimum value
 * if the Attribute is a Number.
 */
export default class MinValidator extends BaseValidator {
  name = "min";

  /**
   * Min value for the validator.
   */
  @tracked min: number;

  constructor(attribute: AttributeInterface, min: number) {
    super(attribute);
    this.min = min;
  }

  validate(_: string, value: any, attribute: any, _2: Model): string | boolean {
    const type = getValidationType(attribute.type);

    assert("You must define a `min` for MinValidator", isPresent(this.min));

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
    const testValue = parseInt(value, 10);

    if (isNaN(testValue)) {
      return true;
    }

    return testValue < this.min;
  }
}
