import PatternValidator from "@getflights/ember-attribute-validations/pattern-validator";
/**
 * Validator that checks if the Attribute value
 * is an absolute URL
 *
 * @class URLValidator
 * @extends {PatternValidator}
 */
export default class URLValidator extends PatternValidator {
  name: string;
  pattern: RegExp;
}
