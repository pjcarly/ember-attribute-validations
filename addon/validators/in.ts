import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue } from "../utils";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import { isArray } from "@ember/array";

/**
 * Validator that is used to validate if the
 * value is in range of acceptable values.
 */
export default class InValidator extends BaseValidator {
  name = "in";
  /**
   * Available Enum values
   *
   * @property values
   * @type {Array}
   * @default null
   */
  values!: string[];

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
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
