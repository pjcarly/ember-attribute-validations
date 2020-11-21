import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue, toDate } from "../utils";

/**
 * Validator that checks if the Attribute value is a valid Date.
 */
export default class DateValidator extends BaseValidator {
  name = "date";

  validate(_: string, value: any, _2: any, _3: Model): string | boolean {
    if (hasValue(value)) {
      const date = toDate(value);

      //@ts-ignore
      if (isNaN(date) || date === null) {
        return this.format();
      }
    }

    return false;
  }
}
