import BaseValidator, {
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue, hasBelongsToValue } from "../utils";

/**
 * Validator that checks if the value is set.
 */
export default class RequiredValidator extends BaseValidator<ValidatorOptions> {
  name = "required";

  validate(value: any, _model: Model): string | boolean {
    if (this.attribute.isAttribute) {
      if (!hasValue(value)) {
        return this.format();
      }
    } else if (this.attribute?.meta?.isRelationship) {
      if (this.attribute.meta.kind === "belongsTo") {
        if (!hasBelongsToValue(value)) {
          return this.format();
        }
      }
    }

    return false;
  }
}
