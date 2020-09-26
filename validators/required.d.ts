import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
/**
 * Validator that checks if the value is set.
 *
 * @class  RequiredValidator
 * @extends {Validator}
 */
export default class RequiredValidator extends Validator {
  name: string;
  validate(_: string, value: any, attribute: any, _2: Model): string | boolean;
}
