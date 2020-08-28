import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
/**
 * Validator that checks the precision of a number
 *
 * @class PrecisionValidator
 * @extends {Validator}
 */
export default class PrecisionValidator extends Validator {
  name: string;
  validate(_: string, value: any, attributes: any, _3: Model): string | boolean;
}
