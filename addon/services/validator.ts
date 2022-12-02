import Model from "@ember-data/model";
import { getOwner, setOwner } from "@ember/application";
import { isArray } from "@ember/array";
import { assert } from "@ember/debug";
import Service from "@ember/service";
import { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import DS from "ember-data";
import BaseValidator, { AttributeInterface } from "../base-validator";
import ValidationError from "../error";
import type IntlService from 'ember-intl/services/intl';
import { cached } from "@glimmer/tracking";
import Store from "@ember-data/store";

export interface ValidatorLookup {
  type: string;
  value: any;
  attribute: AttributeInterface;
}

export default class ValidatorService extends Service {
  @service intl!: IntlService;
  @service store!: Store;

  @cached
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

  lookupValidator(lookup: ValidatorLookup): BaseValidator<any> {
    const typeKey = lookup.type;
    const validatorClass = this.lookupValidtorFactory(typeKey);

    assert(
      "Could not find Validator `" + typeKey + "`.",
      typeof validatorClass === "function"
    );

    // These are the ValidatorOptions or an extension of it
    const options: any = {};

    if (lookup.value !== true) {
      options[lookup.type] = lookup.value;
    }

    const validatorInstance = new validatorClass(lookup.attribute, options);
    setOwner(validatorInstance, this.container);
    return validatorInstance;
  }

  /**
   * Resolves the List of Validators for a given attribute.
   */
  validatorsFor(attribute: AttributeInterface): BaseValidator<any>[] {
    const meta = attribute.options;
    let validations = meta?.validation;

    if (isEmpty(validations)) {
      return [];
    }

    if (!isArray(validations)) {
      validations = [validations];
    }

    const validators: ValidatorLookup[] = [];

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
      const result = validator.validate(model.get(name), model);

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
    // @ts-ignore
    relationship: Parameters<Parameters<Model["eachRelationship"]>[0]>[1]
  ) {
    // @ts-ignore
    const validators = this.validatorsFor(relationship);
    // @ts-ignore
    const name = relationship.key;

    // @ts-ignore
    relationship.parentTypeKey =
      // @ts-ignore
      model.constructor.modelName || model.constructor.typeKey;

    validators.forEach((validator) => {
      const result = validator.validate(model.get(name), model);

      if (typeof result === "string") {
        this._addValidationError(model, name, result);
      }
    });
  }


  /**
   * Validate a list of attributes or relationships on the model, it will add errors on the Error object on the Model.
   * And return true if the fields are valid
   * 
   * @param model The Model you want to validate
   * @param fields What attributes or relationships you want to validate
   */
  public validateFields(model: Model, fields: string[]): boolean {
    if (!fields || fields.length === 0) {
      return true;
    }

    let success = true;

    for (const field of fields) {
      const fieldResult = this.validateField(model, field);

      if (!fieldResult) {
        success = false;
      }
    }

    return success;
  }

  /**
   * Validate an attribute or relationship on the model, it will add errors on the Error object on the Model.
   * And return true if the field is valid
   * 
   * @param model The Model you want to validate
   * @param field What attributes or fields you want to validate
   */
  public validateField(model: Model, field: string): boolean {
    // Do not validate the records which are deleted
    if (<boolean>(<unknown>model.isDeleted)) {
      return true;
    }

    const modelClass = this.store.modelFor(model.constructor
      // @ts-ignore
      .modelName);

    // @ts-ignore
    const errors = <unknown>model.errors as DS.Errors;
    errors.remove(field);

    // Clear the errors from the model and set the model
    // into an `uncommitted` state if the model is invalid
    if (!model.isValid) {
      errors.trigger("becameValid");
    }

    const attributes = modelClass.attributes as Map<string, AttributeInterface>;
    if (attributes.has(field)) {
      this._validateAttribute(model, attributes.get(field)!);

      return !errors.has(field);
    }

    const relationships = modelClass.relationshipsByName as Map<string, Parameters<Parameters<Model["eachRelationship"]>[0]>[1]>;
    if (relationships.has(field)) {
      this._validateRelationship(model, relationships.get(field)!);

      return !errors.has(field);
    }

    return true;
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

    // @ts-ignore
    const errors = <DS.Errors>(<unknown>model.errors);
    errors.add(attribute, message);
  }

  validateModel(model: Model): boolean {
    // Do not validate the records which are deleted
    if (<boolean>(<unknown>model.isDeleted)) {
      return true;
    }

    const modelClass = this.store.modelFor(model.constructor
      // @ts-ignore
      .modelName);

    // @ts-ignore
    const errors = <unknown>model.errors as DS.Errors;
    errors.clear();

    // Clear the errors from the model and set the model
    // into an `uncommitted` state if the model is invalid
    if (!model.isValid) {
      errors.trigger("becameValid");
    }

    // @ts-ignore
    modelClass.eachAttribute((_key: string, attribute: AttributeInterface) => {
      this._validateAttribute(model, attribute);
      // run(this, this._validateAttribute, model, attribute);
    });

    // @ts-ignore
    modelClass.eachRelationship((_key, relationship) => {
      this._validateRelationship(model, relationship);
      // run(this, this._validateRelationship, model, relationship);
    });

    return <boolean>(<unknown>errors.isEmpty);
  }

  createValidationError(model: Model) {
    const message = this.intl.t("ember-attribute-validations.error");
    // @ts-ignore
    return new ValidationError(message, <DS.Errors>(<unknown>model.errors));
  }
}
