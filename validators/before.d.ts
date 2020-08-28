import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
/**
 * Validator that checks if the Attribute value
 * is before the specified date
 *
 * @class DateBeforeValidator
 * @extends {Validator}
 */
export default class DateBeforeValidator extends Validator {
  name: string;
  /**
   * before Date to be compared
   *
   * @property before
   * @type {Date|Function}
   * @default null
   */
  validate(_: string, value: any, attribute: any, _2: Model): string | boolean;
  /**
   * Resolves the `before` property to a Valid Date.
   *
   * If the property is a function, it would be invoked
   * with a Model instance context.
   *
   * @method _resolveBeforeDate
   * @private
   * @param  {DS.Model} model
   * @return {Date}
   */
  _resolveBeforeDate(before: () => Date | Date): Date | null;
  /**
   * Compares the two given Dates.
   *
   * @method _compareDates
   * @private
   * @param  {Date} date
   * @param  {Date} before
   * @return {Boolean}
   */
  _compareDates(date: Date, before: Date): boolean;
}
