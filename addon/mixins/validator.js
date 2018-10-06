import Mixin from '@ember/object/mixin';
import ValidationError from '../error';
import defaultMessages from '../messages';
import { canInvoke } from '../utils';
import { getOwner } from '@ember/application';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';
import { camelize } from '@ember/string';
import { reject } from 'rsvp';

function createValidationError(model) {
  const messageResolver = lookupMessageResolver(getOwner(model));
  const errors = model.get('errors');
  let message = messageResolver.resolveMessage('error');

  if(isEmpty(message)) {
    message = get(defaultMessages, 'error');
  }

  return new ValidationError(message, errors);
}

function lookupMessageResolver(container) {
  return container.lookup('resolver:validation-message') ||
    container.lookup('ember-attribute-validations@resolver:validation-message');
}

function lookupValidtorFactory(container, key) {
  return container.factoryFor(`validator:${key}`).class || container.factoryFor(`ember-attribute-validations@validator:${key}`).class;
}

function lookupValidator(container, obj) {
  const typeKey = obj.type;
  const validatorClass = lookupValidtorFactory(container, typeKey);

  assert('Could not find Validator `' + typeKey + '`.', typeof validatorClass === 'function');

  const messageResolver = lookupMessageResolver(container);
  let value = obj.value;

  if (typeof value !== 'object') {
    value = {};

    value[obj.type] = obj.value;
  }

  merge(value, {
    attribute: obj.attribute,
    messageResolver: messageResolver
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
    attribute.parentTypeKey = this.constructor.modelName ||
      this.constructor.typeKey;

    const errors = this.get('errors');

    validators.forEach((validator) => {
      const result = validator.validate(name, this.get(name), attribute, this);

      if (typeof result === 'string') {
        if(canInvoke(errors, '_add')) {
          errors._add(name, result);
        } else {
          errors.add(name, result);
        }
      }
    });
  },

  _validateRelationship(relationship) {
    const validators = this.validatorsFor(relationship);
    const name = relationship.key;

    relationship.parentTypeKey = this.constructor.modelName ||
      this.constructor.typeKey;
    const errors = this.get('errors');

    validators.forEach((validator) => {
      const result = validator.validate(name, this.get(name), relationship, this);

      if (typeof result === 'string') {
        if(canInvoke(errors, '_add')) {
          errors._add(name, result);
        } else {
          errors.add(name, result);
        }
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
      //relationship.name = key; // Bugfix Ember-data
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

  save({validate=true}={}) {
    if(!validate) {
      return this._super();
    }

    if (this.validate()) {
      return this._super();
    }

    return reject(createValidationError(this));
  }
});
