import PatternValidator from "@getflights/ember-attribute-validations/pattern-validator";
import { assert } from "@ember/debug";
import { tracked } from "@glimmer/tracking";
import { AttributeInterface } from "../base-validator";

export const uuid: { [key: string]: RegExp } = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

export default class UUIDValidator extends PatternValidator {
  /**
   * Version of the UUID format.
   *
   * By default it would try to validate 1 or 2 versions.
   *
   * Valid arguments are all, 3, 4, 5
   */
  name = "uuid";
  @tracked version: "3" | "4" | "5" | "all" = "all";

  constructor(
    attribute: AttributeInterface,
    version?: "3" | "4" | "5" | "all"
  ) {
    super(attribute);

    if (version) {
      this.version = version;
    }
  }

  get pattern(): RegExp {
    const pattern = uuid[this.version];

    console.log(this.version, pattern);
    assert("Invalid UUID version `" + this.version + "`.", !!pattern);

    return pattern;
  }
}
