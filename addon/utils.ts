import DS from "ember-data";

import { isPresent } from "@ember/utils";
import { isEmpty } from "@ember/utils";

/**
 * Determines which type to use to validate attributes with
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function getValidationType(type: string): string {
  // TODO: find a better way for this, at the moment this module depends on the type of the attribute
  // once we have custom data types, we should be able to switch on something else (perhaps the transform?)
  const numberTypes = ["number", "percent", "price"];

  if (numberTypes.includes(type)) {
    return "number";
  } else {
    return "string";
  }
}

/**
  Checks to see if the `methodName` exists on the `obj`.
  ```javascript
  let foo = { bar: function() { return 'bar'; }, baz: null };
  canInvoke(foo, 'bar'); // true
  canInvoke(foo, 'baz'); // false
  canInvoke(foo, 'bat'); // false
  ```
  @method canInvoke
  @param {Object} obj The object to check for the method
  @param {String} methodName The method name to check for
  @return {Boolean}
  @private
*/
export function canInvoke(obj: any, methodName: string): boolean {
  return (
    obj !== null && obj !== undefined && typeof obj[methodName] === "function"
  );
}

/**
 * Determines whether or not a value is empty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function hasValue(value: any): boolean {
  return isPresent(value) || !isEmpty(value);
}

/**
 * Determines whether or not a belongsToRelationship isEmpty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export function hasBelongsToValue(
  // @ts-ignore
  value: DS.Model | DS.PromiseObject<any>
): boolean | undefined {
  // @ts-ignore
  if (value instanceof DS.Model) {
    // an async:false relationship
    return isPresent(value) && isPresent(value.get("id"));
    // @ts-ignore
  } else if (value instanceof DS.PromiseObject) {
    // an async: true relationship
    return (
      isPresent(value) &&
      value.hasOwnProperty("content") &&
      !isEmpty(value.content)
    );
  }

  return;
}

/**
 * Determines if the value is Boolean.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isBoolean(obj: any): boolean {
  return (
    obj === true ||
    obj === false ||
    Object.prototype.toString.call(obj) === "[object Boolean]"
  );
}

/**
 * Determines if the value is Numeric.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Determines if the value is Numeric.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isString(value: any): boolean {
  return typeof value === "string" || value instanceof String;
}

/**
 * Determines if the value is Integer.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isInt(value: any): boolean {
  return (
    !isNaN(value) &&
    (function (x) {
      return (x | 0) === x;
    })(parseFloat(value))
  );
}

/**
 * Determines if the value is an Object.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

/**
 * Determines if the value is an Array.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Returns the amount of digits after the decimal
 *
 * @param  numeric value
 * @return integer
 */
export function decimalPlaces(num: number): number {
  var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  return Math.max(
    0,
    (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
  );
}

/**
 * Returns the amount of digits
 *
 * @param  numeric value
 * @return integer
 */
export function amountOfDigits(num: number): number {
  return (num + "").replace(".", "").replace(",", "").length;
}

/**
 * Converts the input to Date instance.
 *
 * If the value can not be converted, `null` is returned.
 *
 * @param  {*} value
 * @return {Date}
 */
export function toDate(value: any): Date | null {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return value;
  }

  if (typeof value === "number") {
    value = new Date(value);
  } else {
    value = Date.parse(value);
  }

  return !isNaN(value) ? new Date(value) : null;
}
