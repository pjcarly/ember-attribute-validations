import EmberObject from '@ember/object';
import defaultMessages from 'ember-attribute-validations/messages';
import { getValidationType } from 'ember-attribute-validations/utils';
import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';
import { get } from '@ember/object';

import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';

function dictionary() {
  var dict = EmberObject.create();
  dict['_dict'] = null;
  delete dict['_dict'];
  return dict;
}

/**
 * Resolver used to resolve and locate the validation messages
 * for Validators.
 *
 * By default this would load the messages that are
 * defined by this Addon.
 *
 * To implement your own message lookup, you just
 * need to redefine this class.
 *
 * @class  MessageResolver
 * @extends {EmberObject}
 */
export default EmberObject.extend({
  intl: service(),

  init() {
    this._cache = dictionary(null);
  },

  /**
   * Resolve the Message for the given Validator and Attribute.
   *
   * It would first try to locate the message with it's full name,
   * which is constructed like `validatorType.attributeType`
   *
   * @example
   * DS.Model.extend({
   *     name: DS.attr('string', {
   *       validation: {
   *         required: true
   *       }
   *     })
   *   });
   *
   * The full name would be `required.string`.
   * If the message with full name is not found it would
   * then try to find with just the Validator type, in this
   * case it would be just `required`.
   *
   * @method resolve
   * @param  {Validator} validator
   * @param  {Attribute} attribute
   * @return {String}
   */
  resolve(validator, attribute) {
    const parsedName = this.parseName(validator, attribute);
    const lookupKeys = ['modelPath', 'validatorPath', 'validatorType'];

    let message;

    lookupKeys.forEach((key) => {
      if (isPresent(message)) {
        return;
      }

      const name = parsedName[key];

      assert(key + ' must be a string, you passed `' + typeof name + '`', typeof name === 'string');

      message = this._cache[name];

      if(!message) {
        message = this._cache[name] = this.resolveMessage(name);
      }
    });

    assert('Could not resolve message for `' + parsedName.validatorType +
      '` Validator and  `' + parsedName.attributeType + '` ', isPresent(message));

    return message;
  },

  /**
   * This method is doing the real lookup of the Validation message.
   *
   * This would be the best place to implement your own lookup
   * logic.
   *
   * @method resolveMessage
   * @param  {String} key The validation Message key
   * @return {String}
   */
  resolveMessage(key) {
    return get(defaultMessages, key);
  },

  /**
   * Resolves the Attribute Label message.
   *
   * Returns a label format of the attribute name
   * to make it more readable for the user.
   *
   * If a `label` property is available in the Attribute description,
   * for this Attribute, this would be returned.
   *
   * Otherwise we would try to format the label from the
   * Attribute name.
   *
   * @param  {Validator} validator
   * @param  {Attribute} attribute
   * @return {String}
   */
  resolveLabel(validator, attribute) {
    const intl = this.get('intl');
    const modelType = attribute.parentType.modelName;
    const field = attribute.name;

    let message = '';
    if(intl.exists(`ember-field-components.${modelType}.fields.${field}`)) {
      message = intl.t(`ember-field-components.${modelType}.fields.${field}`);
    } else if(intl.exists(`ember-field-components.global.fields.${field}`)) {
      message = intl.t(`ember-field-components.global.fields.${field}`);
    } else {
      message = capitalize(field);
    }

    return message;
  },

  /**
   * Used to format the lookup paramters.
   *
   * @method parseName
   * @param  {Validator} validator
   * @param  {Attribute} attribute
   * @return {String}
   */
  parseName(validator, attribute) {
    const attributeType = this._parseAttributeType(attribute);
    const modelType = this._parseModelType(attribute);
    const validatorType = this._parseValidatorType(validator);

    return {
      attributeType,
      validatorType,
      modelType,
      validatorPath: validatorType + '.' + attributeType,
      modelPath: modelType + '.' + attribute.name + '.' + validatorType
    };
  },

  /**
   * Resolve the Model name from the attribute.
   *
   * @private
   * @method _parseModelType
   * @param  {Attribute} attribute
   * @return {String}
   */
  _parseModelType(attribute) {
    return attribute.parentTypeKey;
  },

  /**
   * Find the Validator type name.
   *
   * This is normaly located in the Validators constructor
   * method property `typeKey`.
   *
   * @private
   * @method _parseValidatorType
   * @param  {Validator} validator
   * @return {String}
   */
  _parseValidatorType(validator) {
    return validator.typeKey ||
      validator.constructor && validator.constructor.typeKey || '';
  },

  /**
   * Find the type of the Attribute from it's definition.
   *
   * @example
   *   DS.Model.extend({
   *     name: DS.attr('string') // type is string
   *   })
   *
   * @private
   * @method _parseAttributeType
   * @param  {Attribute} attribute
   * @return {String}
   */
  _parseAttributeType(attribute) {
    return getValidationType(attribute.type);
  },

  /**
   * Clears the Message cache
   *
   * @method clearCache
   */
  clearCache() {
    this._cache = dictionary(null);
  }

});
