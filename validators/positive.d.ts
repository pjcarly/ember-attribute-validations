import Validator from 'ember-attribute-validations/validator';
import Model from 'ember-data/model';
/**
 * Validator that checks if the Attribute value is a positive number.
 *
 * @class PositiveValidator
 * @extends {Validator}
 */
export default class PositiveValidator extends Validator {
    name: string;
    validate(_: string, value: any, _2: any, _3: Model): string | boolean;
}
