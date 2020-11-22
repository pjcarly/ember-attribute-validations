import Model from "@ember-data/model";
import { inject as service } from "@ember/service";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import { capitalize } from "@ember/string";
import { tracked } from "@glimmer/tracking";

export interface AttributeInterface {
  parentTypeKey: string;
  name: string;
  type: string;
  isAttribute: boolean;
  meta?: {
    isRelationship?: boolean;
  };
  options?: {
    validation?: any;
  };
}

/**
 * Validator Class used to perform specific Attribute
 * Validation.
 */
export default abstract class BaseValidator {
  @service intl!: any;

  @tracked attribute: AttributeInterface;
  abstract name: string;

  constructor(attribute: AttributeInterface) {
    this.attribute = attribute;
  }

  /**
   * This Property returns the intlKey that can be used to resolve a validation message
   *
   * @property message
   * @type String
   */
  get intlKey(): string {
    assert(
      `Your validator is missing a name. You must add the property "name" to your validator class, which contains a string name of the validator.`,
      isPresent(this.name)
    );

    const attributeType = this.attribute.type;
    const modelName = this.attribute.parentTypeKey;
    const validatorName = this.name;

    let intlKey;

    if (
      this.intl.exists(
        `ember-attribute-validations.${modelName}.${validatorName}.${attributeType}`
      )
    ) {
      intlKey = `ember-attribute-validations.${modelName}.${validatorName}.${attributeType}`;
    } else if (
      this.intl.exists(
        `ember-attribute-validations.${modelName}.${validatorName}`
      )
    ) {
      intlKey = `ember-attribute-validations.${modelName}.${validatorName}`;
    } else if (
      this.intl.exists(
        `ember-attribute-validations.${validatorName}.${attributeType}`
      )
    ) {
      intlKey = `ember-attribute-validations.${validatorName}.${attributeType}`;
    } else if (
      this.intl.exists(`ember-attribute-validations.${validatorName}`)
    ) {
      intlKey = `ember-attribute-validations.${validatorName}`;
    }

    assert(
      `No validator message found for validator: '${validatorName}', attributeType: '${attributeType}', modelName: '${modelName}'`,
      isPresent(intlKey)
    );

    // @ts-ignore
    return intlKey;
  }

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
   */
  get attributeLabel(): string {
    const modelName = this.attribute.parentTypeKey;
    const field = this.attribute.name;

    let label = "";
    if (
      this.intl.exists(`ember-field-components.${modelName}.fields.${field}`)
    ) {
      label = this.intl.t(
        `ember-field-components.${modelName}.fields.${field}`
      );
    } else if (
      this.intl.exists(`ember-field-components.global.fields.${field}`)
    ) {
      label = this.intl.t(`ember-field-components.global.fields.${field}`);
    } else {
      label = capitalize(field);
    }

    return label;
  }

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
   */
  abstract validate(
    attributeName: string,
    value: any,
    meta: any,
    model: Model
  ): string | boolean;

  /**
   * Formats the validation error message.
   *
   * All arguments passed to this function would be used by the
   *
   */
  format(messageParameters: { [key: string]: string } = {}): string {
    const intlKey = this.intlKey;

    if (!messageParameters.hasOwnProperty("label")) {
      messageParameters.label = this.attributeLabel;
    }

    return this.intl.t(intlKey, messageParameters);
  }
}
