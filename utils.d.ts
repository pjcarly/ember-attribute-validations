import Model from "@ember-data/model";
import DS from "ember-data";
/**
 * Determines which type to use to validate attributes with
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export declare function getValidationType(type: string): string;
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
export declare function canInvoke(obj: any, methodName: string): boolean;
/**
 * Determines whether or not a value is empty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export declare function hasValue(value: any): boolean;
/**
 * Determines whether or not a belongsToRelationship isEmpty
 *
 * @param  {*}  value
 * @return {Boolean}
 */
export declare function hasBelongsToValue(value: Model | DS.PromiseObject<any>): boolean | undefined;
/**
 * Determines if the value is Boolean.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export declare function isBoolean(obj: any): boolean;
/**
 * Determines if the value is Numeric.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export declare function isNumeric(value: any): boolean;
/**
 * Determines if the value is Numeric.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export declare function isString(value: any): boolean;
/**
 * Determines if the value is Integer.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export declare function isInt(value: any): boolean;
/**
 * Determines if the value is an Object.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export declare function isObject(value: any): boolean;
/**
 * Determines if the value is an Array.
 *
 * @param  {*}  obj
 * @return {Boolean}
 */
export declare function isArray(value: any): boolean;
/**
 * Returns the amount of digits after the decimal
 *
 * @param  numeric value
 * @return integer
 */
export declare function decimalPlaces(num: number): number;
/**
 * Returns the amount of digits
 *
 * @param  numeric value
 * @return integer
 */
export declare function amountOfDigits(num: number): number;
/**
 * Converts the input to Date instance.
 *
 * If the value can not be converted, `null` is returned.
 *
 * @param  {*} value
 * @return {Date}
 */
export declare function toDate(value: any): Date | null;
