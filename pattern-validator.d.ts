import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
/**
 * Validator that uses a RegExp pattern to test
 * the attribute value.
 *
 * You should be able to create a PatternValidator by
 * just assigning a `pattern` value.
 *
 * @class PatternValidator
 * @extends {Validator}
 */
export default abstract class PatternValidator extends Validator {
  /**
   * RegExp like pattern that would be used to test
   * the Attribute value.
   *
   * @property pattern
   * @type {RegExp}
   * @default null
   */
  pattern: RegExp;
  validate(_: string, value: any, _2: any, _3: Model): string | false;
}
