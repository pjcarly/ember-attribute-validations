import Validator from 'ember-attribute-validations/validator';
import Model from 'ember-data/model';
/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */
export default class WholeNumberValidator extends Validator {
    name: string;
    validate(_: string, value: any, _2: any, _3: Model): string | boolean;
}
