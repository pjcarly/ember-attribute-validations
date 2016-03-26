import Validator from 'ember-attribute-validations/validator';
import Ember from 'ember';
import { amountOfDigits } from 'ember-attribute-validations/utils';

/**
 * Validator that checks if the Attribute value
 * is a number.
 *
 * @class NumberValidator
 * @extends {Validator}
 */
export default Validator.extend({
	validate: function(name, value, attributes) {
		if (!Ember.isBlank(value) && !isNaN(value) && (amountOfDigits(value) > attributes.options.validation.precision)) {
			return this.format(attributes.options.validation.precision);
		}
	}
});
