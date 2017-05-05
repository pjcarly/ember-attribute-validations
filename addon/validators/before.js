import Ember from 'ember';
import Validator from 'ember-attribute-validations/validator';
import { hasValue, toDate } from '../utils';

const { typeOf, run, assert, isPresent } = Ember;

/**
 * Validator that checks if the Attribute value
 * is before the specified date
 *
 * @class DateBeforeValidator
 * @extends {Validator}
 */
export default Validator.extend({

	/**
	 * Before Date to be compared
	 *
	 * @property before
	 * @type {Date|Function}
	 * @default null
	 */
	before: null,

	validate: function(name, value, attribute, model) {
		if(hasValue(value)) {
			const date = toDate(value);
			const before = this._resolveBeforeDate(model);

			if(this._compareDates(date, before)) {
				return this.format(date, before);
			}
		}
	},

	/**
	 * Resolves the `before` property to a Valid Date.
	 *
	 * If the property is a function, it would be invoked
	 * with a Model instance context.
	 *
	 * @method _resolveBeforeDate
	 * @private
	 * @param  {DS.Model} model
	 * @return {Date}
	 */
	_resolveBeforeDate: function(model) {
		let before = this.get('before');

		if(typeOf(before) === 'function') {
			before = run(model, before);
		}

		assert('You must define a `before` Date for DateBeforeValidator', isPresent(before));

		return toDate(before);
	},

	/**
	 * Compares the two given Dates.
	 *
	 * @method _compareDates
	 * @private
	 * @param  {Date} date
	 * @param  {Date} before
	 * @return {Boolean}
	 */
	_compareDates: function(date, before) {
		return !!(date && before && date > before);
	}
});
