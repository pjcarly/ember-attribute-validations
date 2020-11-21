import BaseValidator from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue, hasBelongsToValue } from "../utils";

/**
 * Validator that checks if the value is set.
 */
export default class RequiredValidator extends BaseValidator {
  name = "required";

  validate(_: string, value: any, attribute: any, _2: Model): string | boolean {
    if (attribute.isAttribute) {
      if (!hasValue(value)) {
        return this.format();
      }
    } else if (attribute.meta.isRelationship) {
      if (attribute.meta.kind === "belongsTo") {
        if (!hasBelongsToValue(value)) {
          return this.format();
        }
      }
    }

    return false;
  }
}
