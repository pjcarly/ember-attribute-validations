import Validator from 'ember-attribute-validations/validator';

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */

export default Validator.extend({
	validate: function(name, value) {

		if (!Ember.isBlank(value) && isNaN(value)) {
			return this.format();
		}
	}
});
