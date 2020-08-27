import Validator from 'ember-attribute-validations/validator';
import Model from 'ember-data/model';
/**
 * Validator that is used to validate if the
 * value is in range of acceptable values.
 *
 * @class  InValidator
 * @extends {Validator}
 */
export default class InValidator extends Validator {
    name: string;
    /**
     * Available Enum values
     *
     * @property values
     * @type {Array}
     * @default null
     */
    values: string[];
    validate(_: string, value: any, _2: any, _3: Model): string | boolean;
}
