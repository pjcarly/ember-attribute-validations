import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "@ember-data/model";
/**
 * Validator that checks if the Attribute value is a negative number
 *
 * @class NegativeValidator
 * @extends {Validator}
 */
export default class NegativeValidator extends Validator {
  name: string;
  validate(_: string, value: any, _2: any, _3: Model): string | boolean;
}
