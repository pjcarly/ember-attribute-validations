import PatternValidator from "@getflights/ember-attribute-validations/pattern-validator";
import { assert } from "@ember/debug";
import { tracked } from "@glimmer/tracking";
import { AttributeInterface, ValidatorOptions } from "../base-validator";

export const uuid: { [key: string]: RegExp } = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

export interface UUIDValidatorOptions extends ValidatorOptions {
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
  @tracked version: "3" | "4" | "5" | "all" = "all";

  constructor(attribute: AttributeInterface, options?: UUIDValidatorOptions) {
    super(attribute, options);

    assert("You must define a `version` for UUIDValidator", options?.version);
    assert(
      "You must define a `version` for UUIDValidator",
      ["3", "4", "5", "all"].includes(options.version)
    );

    this.version = options.version;
  }

  get pattern(): RegExp {
    const pattern = uuid[this.version];

    assert("Invalid UUID version `" + this.version + "`.", !!pattern);

    return pattern;
  }
}
