import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
/**
 * Validator that checks if the Attribute value
 * has a max amount of decimals
 *
 * @class DecimalsValidator
 * @extends {Validator}
 */
export default class DecimalsValidator extends Validator {
  name: string;
  validate(_: string, value: any, attributes: any, _3: Model): string | boolean;
}
