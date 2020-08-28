import Validator from "@getflights/ember-attribute-validations/validator";
import Model from "ember-data/model";
/**
 * Acceptance Validator used to validate boolean like
 * Attributes.
 *
 * @class  AcceptanceValidator
 * @extends {Validator}
 */
export default class AcceptanceValidator extends Validator {
  name: string;
  validate(_: string, value: any, _2: any, _3: Model): string | boolean;
}
