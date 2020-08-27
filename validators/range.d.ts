import Model from "ember-data/model";
import Validator from "ember-attribute-validations/validator";
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
    name: string;
    /**
     * Number representing the starting point
     * of the range validation.
     *
     * @property from
     * @type {Number}
     * @default null
     */
    from: number;
    /**
     * Number representing the ending point
     * of the range validation.
     *
     * @property to
     * @type {Number}
     * @default null
     */
    to: number;
    validate(_: string, value: any, attribute: any, _2: Model): string | boolean;
    validateString(value: string): boolean;
    validateNumber(value: string): boolean;
}
