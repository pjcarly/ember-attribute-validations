import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
import { hasValue, hasBelongsToValue } from "../utils";

/**
 * Validator that checks if the value is set.
 *
 * @class  RequiredValidator
 * @extends {Validator}
 */
export default class RequiredValidator extends Validator {
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
