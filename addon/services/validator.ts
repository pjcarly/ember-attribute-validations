import Model from "@ember-data/model";
import { getOwner, setOwner } from "@ember/application";
import { isArray } from "@ember/array";
import { assert } from "@ember/debug";
import { computed } from "@ember/object";
import { assign } from "@ember/polyfills";
import { run } from "@ember/runloop";
import Service from "@ember/service";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import DS from "ember-data";
import { AttributeInterface } from "../base-validator";
import ValidationError from "../error";

export default class ValidatorService extends Service {
  @service intl!: any;

  @computed()
  get container(): any {
    return getOwner(this);
  }

  lookupValidtorFactory(key: string) {
    return (
      this.container.factoryFor(`validator:${key}`).class ||
      this.container.factoryFor(`ember-attribute-validations@validator:${key}`)
        .class
    );
  }

  lookupValidator(validator: any) {
    const typeKey = validator.type;
    const validatorClass = this.lookupValidtorFactory(typeKey);

    assert(
      "Could not find Validator `" + typeKey + "`.",
      typeof validatorClass === "function"
    );

    let value = validator.value;

    if (typeof value !== "object") {
      value = {};

      value[validator.type] = validator.value;
    }

    assign(value, {
      attribute: validator.attribute,
      container: this.container,
    });

    validatorClass.typeKey = camelize(typeKey);

    const validatorInstance = new validatorClass(value.attribute);
    setOwner(validatorInstance, this.container);
    return validatorInstance;
  }

  /**
   * Resolves the List of Validators for a given attribute.
   */
  validatorsFor(attribute: AttributeInterface) {
    const meta = attribute.options;
    let validations = meta?.validation;

    if (isEmpty(validations)) {
      return [];
    }

    if (!isArray(validations)) {
      validations = [validations];
    }

    const validators: any[] = [];

    validations.forEach((validation: any) => {
      const keys = Object.keys(validation);

      keys.forEach((name) => {
        validators.push({
          type: name,
          value: validation[name],
          attribute: attribute,
        });
      });
    });

    return validators.map((validator) => {
      return this.lookupValidator(validator);
    });
  }

  /**
   * Validate a single Attribute.
   *
   * If the Attribute has defined validation, it would try to resolve
   * the the required Validators and run validation.
   *
   * For each failed validation, error message is added to the Errors
   * object for it's attribute name.
   *
   */
  private _validateAttribute(model: Model, attribute: AttributeInterface) {
    const validators = this.validatorsFor(attribute);
    const name = attribute.name;

    // Assign the Model name to the Attribute
    attribute.parentTypeKey =
      // @ts-ignore
      model.constructor.modelName || model.constructor.typeKey;

    validators.forEach((validator) => {
      // @ts-ignore
      const result = validator.validate(name, model.get(name), attribute, this);

      if (typeof result === "string") {
        this._addValidationError(model, name, result);
      }
    });
  }

  /**
   * Validate a single Relationship.
   *
   * If the Relationship has defined validation, it would try to resolve
   * the the required Validators and run validation.
   *
   * For each failed validation, error message is added to the Errors
   * object for it's relationship name.
   */
  private _validateRelationship(
    model: Model,
    relationship: Parameters<Parameters<Model["eachRelationship"]>[0]>[1]
  ) {
    // @ts-ignore
    const validators = this.validatorsFor(relationship);
    const name = relationship.key;

    // @ts-ignore
    relationship.parentTypeKey =
      // @ts-ignore
      model.constructor.modelName || model.constructor.typeKey;

    validators.forEach((validator) => {
      const result = validator.validate(
        name,
        model.get(name),
        relationship,
        model
      );

      if (typeof result === "string") {
        this._addValidationError(model, name, result);
      }
    });
  }

  /**
   * Adds a validation message to the model
   */
  private _addValidationError(model: Model, attribute: any, message: string) {
    // If the model is in a Saved state, flag it as dirty.
    if (!model.hasDirtyAttributes) {
      model
        // @ts-ignore
        .send("becomeDirty");
    }

    const errors = <DS.Errors>(<unknown>model.errors);
    errors.add(attribute, message);
  }

  validateModel(model: Model): boolean {
    // Do not validate the records which are deleted
    if (<boolean>(<unknown>model.isDeleted)) {
      return true;
    }

    const errors = <DS.Errors>(<unknown>model.errors);
    errors.clear();

    // Clear the errors from the model and set the model
    // into an `uncommitted` state if the model is invalid
    if (!model.isValid) {
      errors.trigger("becameValid");
    }

    // @ts-ignore
    model.eachAttribute((_key: string, attribute: AttributeInterface) => {
      run(this, this._validateAttribute, model, attribute);
    });

    model.eachRelationship((_key, relationship) => {
      run(this, this._validateRelationship, model, relationship);
    });

    const isValid = <boolean>(<unknown>errors.isEmpty);

    // Move the model into an 'invalid' state if the errors
    // are not empty
    if (!isValid) {
      errors.trigger("becameInvalid");
    }

    return isValid;
  }

  createValidationError(model: Model) {
    const message = this.intl.t("ember-attribute-validations.error");
    return new ValidationError(message, <DS.Errors>(<unknown>model.errors));
  }
}
