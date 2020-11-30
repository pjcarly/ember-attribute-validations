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

export interface DateBeforeValidatorOptions extends ValidatorOptions {
  before: (() => Date) | Date;
}

/**
 * Validator that checks if the Attribute value
 * is before the specified date
 */
export default class DateBeforeValidator extends BaseValidator<
  DateBeforeValidatorOptions
> {
  name = "beforeDate";

  before: Date;

  constructor(
    attribute: AttributeInterface,
    options?: DateBeforeValidatorOptions
  ) {
    super(attribute, options);

    assert(
      "You must define a `before` for DateBeforeValidator, this can be a Date or a function returning a date",
      options && options.before
    );

    const resolvedDate = this._resolveBeforeDate(options.before);
    assert("Invalid date resolved by the date before validation", resolvedDate);

    this.before = resolvedDate;
  }

  /**
   * before Date to be compared
   *
   * @property before
   * @type {Date|Function}
   * @default null
   */

  validate(value: any, _model: Model): string | boolean {
    if (hasValue(value) && value !== false) {
      const date = toDate(value);

      if (!date || !this.before) {
        return this.format();
      }

      if (this._compareDates(date, this.before)) {
        return this.format({ date: this.before.toString() });
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
  private _resolveBeforeDate(before: (() => Date) | Date): Date | null {
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
    return !!(date && before && date.getTime() >= before.getTime());
  }
}
