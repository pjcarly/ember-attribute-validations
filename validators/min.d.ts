import Validator from "ember-attribute-validations/validator";
import Model from "ember-data/model";
/**
 * Validator that could be used to validate minimum length,
 * if the attribute is String, or to validate the minimum value
 * if the Attribute is a Number.
 *
 * @class  MinValidator
 * @extends {Validator}
 */
export default class MinValidator extends Validator {
    name: string;
    /**
     * Min value for the validator.
     *
     * @property min
     * @type {Number}
     * @default null
     */
    min: number;
    validate(_: string, value: any, attribute: any, _2: Model): string | boolean;
    validateString(value: string): boolean;
    validateNumber(value: string): boolean;
}
