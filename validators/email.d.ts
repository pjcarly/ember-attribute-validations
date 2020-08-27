import PatternValidator from 'ember-attribute-validations/pattern-validator';
/**
 * Validator that checks if the Attribute value
 * is a valid Email address
 *
 * @class EmailValidator
 * @extends {PatternValidator}
 */
export default class EmailValidator extends PatternValidator {
    name: string;
    pattern: RegExp;
}
