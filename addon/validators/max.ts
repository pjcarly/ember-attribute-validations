import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
import {
  hasValue,
  getValidationType,
} from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";

/**
 * Validator that could be used to validate maximum length,
 * if the attribute is String, or to validate the maximum value
 * if the Attribute is a Number.
 *
 * @class  MaxValidator
 * @extends {Validator}
 */
export default class MaxValidator extends Validator {
  name = "max";

  /**
   * Max value for the validator.
   *
   * @property max
   * @type {Number}
   * @default null
   */
  max!: number;

  validate(_: string, value: any, attribute: any, _2: Model): string | boolean {
    const type = getValidationType(attribute.type);

    assert("You must define a `max` for MaxValidator", isPresent(this.max));

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
