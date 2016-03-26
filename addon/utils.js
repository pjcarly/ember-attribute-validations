import Ember from 'ember';

/**
 * Determines whether or not a value is empty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function hasValue(value) {
  return Ember.isPresent(value) || !Ember.isEmpty(value);
}

/**
 * Determines whether or not a belongsToRelationship isEmpty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function hasBelongsToValue(value) {
  return Ember.isPresent(value) && value.hasOwnProperty('content') && !Ember.isEmpty(value.content);
}

/**
 * Determines if the value is Boolean.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isBoolean(obj) {
  return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
}

/**
 * Determines if the value is Numeric.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Returns the amount of digits after the decimal
 *
 * @param  numeric value
 * @return integer
 */
export function decimalPlaces(num) {
  var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}

/**
 * Returns the amount of digits
 *
 * @param  numeric value
 * @return integer
 */
export function amountOfDigits(num) {
  return (num + '').replace('.', '').replace(',', '').length;
}

/**
 * Converts the input to Date instance.
 *
 * If the value can not be converted, `null` is returned.
 *
 * @param  {*} value
 * @return {Date}
 */
export function toDate(value) {
	if (Object.prototype.toString.call(value) === '[object Date]') {
		return value;
	}

	if (typeof value === 'number') {
		value = new Date(value);
	} else {
		value = Date.parse(value);
	}

	return !isNaN(value) ? new Date(value) : null;
}
