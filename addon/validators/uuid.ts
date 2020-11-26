import PatternValidator, {
  PatternValidatorOptions,
} from "@getflights/ember-attribute-validations/pattern-validator";
import { assert } from "@ember/debug";
import { AttributeInterface } from "../base-validator";

export const uuid: { [key: string]: RegExp } = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

export interface UUIDValidatorOptions extends PatternValidatorOptions {
  version: "3" | "4" | "5" | "all";
}

export default class UUIDValidator extends PatternValidator<
  UUIDValidatorOptions
> {
  name = "uuid";
  /**
   * Version of the UUID format.
   *
   * By default it would try to validate 1 or 2 versions.
   *
   * Valid arguments are all, 3, 4, 5
   */
  version: "3" | "4" | "5" | "all" = "all";

  constructor(attribute: AttributeInterface, options?: UUIDValidatorOptions) {
    super(attribute, options);

    if (options?.version) {
      assert(
        "Your defined `version` for UUIDValidator is invalid, only 3, 4, 5 and all are supported",
        ["3", "4", "5", "all"].includes(options.version)
      );

      this.version = options.version;
    }

    this.pattern = uuid[this.version];
  }
}
