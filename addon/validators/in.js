import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';
import { hasValue } from '../utils';

const { assert, isPresent, isArray } = Ember;

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

	validate: function(name, value) {
		const values = this.get('values');

		assert('You must define an array of Enum values in order to validate.', isPresent(values) && isArray(values));

		if(hasValue(value) && values.indexOf(value) < 0) {
			return this.format(values.join(', '));
		}
	}
});
