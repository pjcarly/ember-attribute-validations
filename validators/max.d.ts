import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
/**
 * Validator that could be used to validate maximum length,
 * if the attribute is String, or to validate the maximum value
 * if the Attribute is a Number.
 *
 * @class  MaxValidator
 * @extends {Validator}
 */
export default class MaxValidator extends Validator {
  name: string;
  /**
   * Max value for the validator.
   *
   * @property max
   * @type {Number}
   * @default null
   */
  max: number;
  validate(_: string, value: any, attribute: any, _2: Model): string | boolean;
  validateString(value: string): boolean;
  validateNumber(value: string): boolean;
}
