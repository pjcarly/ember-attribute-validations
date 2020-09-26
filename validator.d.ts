import EmberObject from "@ember/object";
import Model from "@ember-data/model";
/**
 * Validator Class used to perform specific Attribute
 * Validation.
 *
 * @class Validator
 * @extends {EmberObject}
 */
export default abstract class Validator extends EmberObject {
  intl: any;
  attribute: any;
  name: string;
  /**
   * This Property returns the intlKey that can be used to resolve a validation message
   *
   * @property message
   * @type String
   */
  get intlKey(): string;
  /**
   * Resolves the Attribute Label message.
   *
   * Returns a label format of the attribute name
   * to make it more readable for the user.
   *
   * For this we have a "soft" dependency on the ember-field-components addon.
   * It finds the label name in the ember-intl translations under the keys:
   *  - ember-field-components.{modelType}.fields.{attribute}
   *  - ember-field-components.{global}.fields.{attribute}
   *
   * The first found value is returned.
   * If nothing is found, the attribute name will be capitalized.
   *
   * You dont need to install the ember-field-components addon,
   * you can simply add the correct keys in the ember-intl translations.
   *
   * @property attributeLabel
   * @type {String}
   */
  get attributeLabel(): string;
  /**
   * Validates the Model attribute.
   *
   * This method should return a `falsy` value if the validation
   * passes the test.
   *
   * Otherwise an error message would be returned.
   *
   * This method should be implemented by all extending classes.
   *
   * @method validate
   * @param  {String}    name      Attribute name
   * @param  {*}         value     Attribute value
   * @param  {Attribute} attribute Attribute
   * @param  {DS.Model}  model     Model instance
   * @return {String|Boolean}
   */
  abstract validate(
    attribute: string,
    value: any,
    meta: any,
    model: Model
  ): string | boolean;
  /**
   * Formats the validation error message.
   *
   * All arguments passed to this function would be used by the
   *
   * @method format
   * @param {*} messageParameters Key value parameters that will be passed into the intl.t() function
   * @return {String}
   */
  format(messageParameters?: { [key: string]: string }): string;
}
