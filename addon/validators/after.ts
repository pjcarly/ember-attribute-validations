import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue, toDate } from "../utils";
import { typeOf } from "@ember/utils";
import { run } from "@ember/runloop";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";

export interface DateAfterValidatorOptions extends ValidatorOptions {
  after: Date | (() => Date);
}

/**
 * Validator that checks if the Attribute value
 * is after the specified date
 */
export default class DateAfterValidator extends BaseValidator<
  DateAfterValidatorOptions
> {
  name = "afterDate";

  after: Date;

  constructor(
    attribute: AttributeInterface,
    options?: DateAfterValidatorOptions
  ) {
    super(attribute, options);

    assert(
      "You must define a `after` for DateAfterValidator, this can be a Date or a function returning a date",
      options && options.after
    );

    const resolvedDate = this._resolveAfterDate(options.after);
    assert("Invalid date resolved by the date after validation", resolvedDate);

    this.after = resolvedDate;
  }

  /**
   * after Date to be compared
   *
   * @property after
   * @type {Date|Function}
   * @default null
   */

  validate(value: any, _model: Model): string | boolean {
    if (hasValue(value) && value !== false) {
      const date = toDate(value);

      if (!date || !this.after) {
        return this.format();
      }

      if (this._compareDates(date, this.after)) {
        return this.format({ date: this.after.toString() });
      }
    }

    return false;
  }

  /**
   * Resolves the `after` property to a Valid Date.
   *
   * If the property is a function, it would be invoked
   * with a Model instance context.
   */
  private _resolveAfterDate(after: (() => Date) | Date): Date | null {
    if (typeOf(after) === "function") {
      // @ts-ignore
      after = run(after);
    }

    assert("You must define a `after` Date on your model", isPresent(after));

    return toDate(after);
  }

  /**
   * Compares the two given Dates.
   */
  private _compareDates(date: Date, after: Date): boolean {
    return !!(date && after && date.getTime() <= after.getTime());
  }
}
