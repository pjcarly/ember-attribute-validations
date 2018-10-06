import Validator from 'ember-attribute-validations/validator';
import { hasValue } from '../utils';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { isArray } from '@ember/array';

/**
 * Validator that is used to validate if the
 * value is in range of acceptable values.
 *
 * @class  InValidator
 * @extends {Validator}
 */
export default Validator.extend({
  /**
   * Available Enum values
   *
   * @property values
   * @type {Array}
   * @default null
   */
  values: null,

  validate(name, value) {
    const values = this.get('values');

    assert('You must define an array of Enum values in order to validate.', isPresent(values) && isArray(values));

    if(hasValue(value) && values.indexOf(value) < 0) {
      return this.format(values.join(', '));
    }
  }
});
