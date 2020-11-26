import BaseValidator, {
  AttributeInterface,
  ValidatorOptions,
} from "@getflights/ember-attribute-validations/base-validator";
import Model from "@ember-data/model";
import { hasValue } from "@getflights/ember-attribute-validations/utils";
import { assert } from "@ember/debug";

export interface PatternValidatorOptions extends ValidatorOptions {
  pattern?: RegExp;
}

/**
 * Validator that uses a RegExp pattern to test
 * the attribute value.
 *
 * You should be able to create a PatternValidator by
 * just assigning a `pattern` value.
 */
export default class PatternValidator<
  T extends PatternValidatorOptions
> extends BaseValidator<T> {
  name = "pattern";

  /**
   * RegExp like pattern that would be used to test
   * the Attribute value.
   *
   * @property pattern
   * @type {RegExp}
   * @default null
   */
  pattern?: RegExp;

  constructor(attribute: AttributeInterface, options?: T) {
    super(attribute, options);
    this.pattern = options?.pattern;
  }

  validate(value: any, _model: Model) {
    assert(
      "You must define a RegExp pattern in order to validate.",
      this.pattern instanceof RegExp
    );

    if (hasValue(value) && !value.toString().match(this.pattern)) {
      return this.format();
    }

    return false;
  }
}
