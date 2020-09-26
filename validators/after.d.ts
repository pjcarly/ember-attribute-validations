import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
/**
 * Validator that checks if the Attribute value
 * is after the specified date
 *
 * @class DateAfterValidator
 * @extends {Validator}
 */
export default class DateAfterValidator extends Validator {
  name: string;
  /**
   * after Date to be compared
   *
   * @property after
   * @type {Date|Function}
   * @default null
   */
  validate(_: string, value: any, attribute: any, _2: Model): string | boolean;
  /**
   * Resolves the `after` property to a Valid Date.
   *
   * If the property is a function, it would be invoked
   * with a Model instance context.
   *
   * @method _resolveAfterDate
   * @private
   * @param  {DS.Model} model
   * @return {Date}
   */
  _resolveAfterDate(after: () => Date | Date): Date | null;
  /**
   * Compares the two given Dates.
   *
   * @method _compareDates
   * @private
   * @param  {Date} date
   * @param  {Date} after
   * @return {Boolean}
   */
  _compareDates(date: Date, after: Date): boolean;
}
