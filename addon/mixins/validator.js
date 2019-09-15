import Mixin from '@ember/object/mixin';
import ValidationError from '../error';
import { canInvoke } from '../utils';
import { getOwner } from '@ember/application';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';
import { camelize } from '@ember/string';
import { reject } from 'rsvp';
import { inject as service } from '@ember/service';

function createValidationError(model, intl) {
  const message = intl.t('ember-attribute-validations.error');
  return new ValidationError(message, model.errors);
}

function lookupValidtorFactory(container, key) {
  return container.factoryFor(`validator:${key}`).class || container.factoryFor(`ember-attribute-validations@validator:${key}`).class;
}

function lookupValidator(container, validator) {
  const typeKey = validator.type;
  const validatorClass = lookupValidtorFactory(container, typeKey);

  assert('Could not find Validator `' + typeKey + '`.', typeof validatorClass === 'function');

  let value = validator.value;

  if (typeof value !== 'object') {
    value = {};

    value[validator.type] = validator.value;
  }

  assign(value, {
    attribute: validator.attribute,
    container: container
  });

  validatorClass.typeKey = camelize(typeKey);

  return validatorClass.create(value);
}

/**
 * Validator Mixin to be used on a DS.Model.
 *
 * Exposes the validation functionality for Ember Models.
 *
 * @class ValidatorMixin
 */
export default Mixin.create({

  intl: service(),

  /**
   * Resolves the List of Validators for a given attribute.
   *
   * @method validatorsFor
   * @param  {Attribute}  attribute
   * @return {Validator}
   */
  validatorsFor(attribute) {
    const meta = attribute.options;
    let validations = get(meta, 'validation');

    if (isEmpty(validations)) {
      return [];
    }

    if (!isArray(validations)) {
      validations = [validations];
    }

    const validators = [];

    validations.forEach((validation) => {
      const keys = Object.keys(validation);

      keys.forEach((name) => {
        validators.push({
          type: name,
          value: validation[name],
          attribute: attribute
        });
      });
    });

    return validators.map((validator) => {
      return lookupValidator(getOwner(this), validator);
    });
  },

  /**
   * Validate a single Attribute.
   *
   * If the Attribute has defined validation, it would try to resolve
   * the the required Validators and run validation.
   *
   * For each failed validation, error message is added to the Errors
   * object for it's attribute name.
   *
   * @method _validateAttribute
   * @param  {Attribute} attribute
   * @private
   */
  _validateAttribute(attribute) {
    const validators = this.validatorsFor(attribute);
    const name = attribute.name;

    // Assign the Model name to the Attribute
    attribute.parentTypeKey = this.constructor.modelName || this.constructor.typeKey;

    validators.forEach((validator) => {
      const result = validator.validate(name, this.get(name), attribute, this);

      if (typeof result === 'string') {
        this._addValidationError(name, result);
      }
    });
  },

  /**
   * Validate a single Relationship.
   *
   * If the Relationship has defined validation, it would try to resolve
   * the the required Validators and run validation.
   *
   * For each failed validation, error message is added to the Errors
   * object for it's relationship name.
   *
   * @method _validateAttribute
   * @param  {Relationship} relationship
   * @private
   */
  _validateRelationship(relationship) {
    const validators = this.validatorsFor(relationship);
    const name = relationship.key;

    relationship.parentTypeKey = this.constructor.modelName || this.constructor.typeKey;

    validators.forEach((validator) => {
      const result = validator.validate(name, this.get(name), relationship, this);

      if (typeof result === 'string') {
        this._addValidationError(name, result);
      }
    });
  },

  /**
   * Validates the Model.
   *
   * If the Model is valid, this method would return `true`.
   *
   * If the validation fails, Model Errors would be populated
   * by validation errors and it would transition into an invalid
   * state.
   *
   * @method validate
   * @return {Boolean}
   * @private
   */
  validate() {
    // Do not validate the records which are deleted
    if (this.get('isDeleted')) {
      return true;
    }

    const errors = this.get('errors');
    errors._clear();

    // Clear the errors from the model and set the model
    // into an `uncommitted` state if the model is invalid
    if (!this.get('isValid')) {
      errors.trigger('becameValid');
    }

    this.eachAttribute((key, attribute) => {
      run(this, '_validateAttribute', attribute);
    });

    this.eachRelationship((key, relationship) => {
      run(this, '_validateRelationship', relationship);
    });

    const isValid = get(errors, 'isEmpty');

    // Move the model into an 'invalid' state if the errors
    // are not empty
    if(!isValid) {
      errors.trigger('becameInvalid');
    }

    return isValid;
  },

  /**
   * Adds a validation message to the model
   *
   * @method _addValidationError
   * @param  {Attribute}  attribute
   * @param  {String}  message
   * @private
   */
  _addValidationError(attribute, message) {
    // If the model is in a Saved state, flag it as dirty.
    if(!this.hasDirtyAttributes) {
      this.send('becomeDirty');
    }

    if(canInvoke(this.errors, '_add')) {
      this.errors._add(attribute, message);
    } else {
      this.errors.add(attribute, message);
    }
  },

  /**
   * Override of the Save method of DS.Model
   * @param {*} param0 Options for the save method. Pass validate=false if you want to ignore validation
   */
  save({validate=true}={}) {
    if(!validate) {
      return this._super();
    }

    if (this.validate()) {
      return this._super();
    }

    return reject(createValidationError(this, this.intl));
  }
});
