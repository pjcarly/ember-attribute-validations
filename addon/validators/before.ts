import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue, toDate } from "../utils";
import { typeOf } from "@ember/utils";
import { run } from "@ember/runloop";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";

/**
 * Validator that checks if the Attribute value
 * is before the specified date
 */
export default class DateBeforeValidator extends BaseValidator {
  name = "beforeDate";

  /**
   * before Date to be compared
   *
   * @property before
   * @type {Date|Function}
   * @default null
   */

  validate(_: string, value: any, attribute: any, _2: Model): string | boolean {
    if (hasValue(value) && value !== false) {
      assert(
        "You must define a `before` Date on your model",
        isPresent(attribute.options.validation.before)
      );

      const date = toDate(value);
      const before = this._resolveBeforeDate(
        attribute.options.validation.before
      );

      if (!date || !before) {
        return this.format();
      }

      if (this._compareDates(date, before)) {
        return this.format({ date: before.toString() });
      }
    }

    return false;
  }

  /**
   * Resolves the `before` property to a Valid Date.
   *
   * If the property is a function, it would be invoked
   * with a Model instance context.
   */
  private _resolveBeforeDate(before: () => Date | Date): Date | null {
    if (typeOf(before) === "function") {
      // @ts-ignore
      before = run(before);
    }

    assert("You must define a `before` Date on your model", isPresent(before));

    return toDate(before);
  }

  /**
   * Compares the two given Dates.
   */
  private _compareDates(date: Date, before: Date) {
    return !!(date && before && date > before);
  }
}
