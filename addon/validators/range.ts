import Model from "@ember-data/model";
import Validator from "@getflights/ember-attribute-validations/validator";
import { getValidationType } from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";

/**
 * Validator that could be used to validate Strings and Numbers.
 *
 * If the value is a String it's length should be in the defined range.
 * If it is a Number, it's value should be in defined range.
 *
 * @class  RangeValidator
 * @extends {Validator}
 */
export default class RangeValidator extends Validator {
  name = "range";

  /**
   * Number representing the starting point
   * of the range validation.
   *
   * @property from
   * @type {Number}
   * @default null
   */
  from!: number;

  /**
   * Number representing the ending point
   * of the range validation.
   *
   * @property to
   * @type {Number}
   * @default null
   */
  to!: number;

  validate(_: string, value: any, attribute: any, _2: Model): string | boolean {
    const type = getValidationType(attribute.type);

    assert("You must define a `from` for RangeValidator", isPresent(this.from));
    assert("You must define a `to` for RangeValidator", isPresent(this.to));

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
