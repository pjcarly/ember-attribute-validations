import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
import { hasValue, toDate } from "../utils";
import { typeOf } from "@ember/utils";
import { run } from "@ember/runloop";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";

/**
 * Validator that checks if the Attribute value
 * is after the specified date
 *
 * @class DateAfterValidator
 * @extends {Validator}
 */
export default class DateAfterValidator extends Validator {
  name = "afterDate";

  /**
   * after Date to be compared
   *
   * @property after
   * @type {Date|Function}
   * @default null
   */

  validate(_: string, value: any, attribute: any, _2: Model): string | boolean {
    if (hasValue(value)) {
      assert(
        "You must define a `after` Date on your model",
        isPresent(attribute.options.validation.after)
      );

      const date = toDate(value);
      const after = this._resolveAfterDate(attribute.options.validation.after);

      if (!date || !after) {
        return this.format();
      }

      if (this._compareDates(date, after)) {
        return this.format({ date: after.toString() });
      }
    }

    return false;
  }

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
  _resolveAfterDate(after: () => Date | Date) {
    if (typeOf(after) === "function") {
      // @ts-ignore
      after = run(after);
    }

    assert("You must define a `after` Date on your model", isPresent(after));

    return toDate(after);
  }

  /**
   * Compares the two given Dates.
   *
   * @method _compareDates
   * @private
   * @param  {Date} date
   * @param  {Date} after
   * @return {Boolean}
   */
  _compareDates(date: Date, after: Date) {
    return !!(date && after && date < after);
  }
}
