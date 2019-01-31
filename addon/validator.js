import EmberObject from '@ember/object';
import EmberError from '@ember/error';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { isArray } from '@ember/array';
import { inspect } from '@ember/debug';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

function format(str, formats) {
  let cachedFormats = formats;

  if (!isArray(cachedFormats) || arguments.length > 2) {
    cachedFormats = new Array(arguments.length - 1);

    for (let i = 1, l = arguments.length; i < l; i++) {
      cachedFormats[i - 1] = arguments[i];
    }
  }

  let idx = 0;
  return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
    argIndex = (argIndex) ? parseInt(argIndex, 10) - 1 : idx++;
    s = cachedFormats[argIndex];
    return (s === null) ? '(null)' : (s === undefined) ? '' : inspect(s);
  });
}

/**
 * Validator Class used to perform specific Attribute
 * Validation.
 *
 * @class Validator
 * @extends {EmberObject}
 */
export default EmberObject.extend({
  intl: service(),

  /**
   * Validation message that is returned when an
   * Attribute is invalid.
   *
   * By default Message is resolved using the
   * `MessageResolver`.
   *
   * @property message
   * @type String
   */
  message: computed('attribute', function() {
    const attribute = this.get('attribute');

    return this.messageResolver.resolve(this, attribute);
  }),

  /**
   * Returns a label format of the attribute name
   * to make it more readable for the user.
   *
   * By default attribute label is resolved using the
   * `MessageResolver`.
   *
   * @property attributeLabel
   * @type {String}
   */
  attributeLabel: computed('attribute', 'intl.locale', function() {
    const attribute = this.get('attribute');

    return this.messageResolver.resolveLabel(this, attribute);
  }),

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
  validate( /*attribute, value, meta, model*/ ) {
    throw new EmberError('You must implement `validate` method on your Validator.');
  },

  /**
   * Formats the validation error message.
   *
   * All arguments passed to this function would be used by the
   *
   * @method format
   * @return {String}
   */
  format() {
    const message = this.get('message');
    const label = this.get('attributeLabel');

    assert('Message must be defined for this Validator', isPresent(message));

    const args = Array.prototype.slice.call(arguments);

    args.unshift(label);
    args.unshift(message);

    const formatted = format.apply(null, args);

    return formatted;
  }

});
