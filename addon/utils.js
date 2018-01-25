import Ember from 'ember';
import DS from 'ember-data';

const { isPresent, isEmpty } = Ember;

/**
 * Determines which type to use to validate attributes with
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function getValidationType(type) {
  // TODO: find a better way for this, at the moment this module depends on the type of the attribute
  // once we have custom data types, we should be able to switch on something else (perhaps the transform?)
  const numberTypes = ['number', 'percent', 'price'];

  if(numberTypes.includes(type)){
    return 'number';
  } else {
    return 'string';
  }
}

/**
 * Determines whether or not a value is empty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function hasValue(value) {
  return isPresent(value) || !isEmpty(value);
}

/**
 * Determines whether or not a belongsToRelationship isEmpty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function hasBelongsToValue(value) {
  if(value instanceof DS.Model) { // an async:false relationship
    return isPresent(value) && isPresent(value.get('id'));
  } else if(value instanceof DS.PromiseObject) { // an async: true relationship
    return isPresent(value) && value.hasOwnProperty('content') && !isEmpty(value.content);
  }
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
 * Determines if the value is Integer.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isInt(value){
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
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
