import DS from 'ember-data';
/**
 * Error thrown when a Model validation fails.
 *
 * This error contains the `DS.Errors` object from the Model.
 *
 * @class ValidationError
 * @extends {Error}
 * @param {Srting}    message
 * @param {DS.Errors} errors
 */
declare function ValidationError(this: any, message: string, errors: DS.Errors): void;
declare namespace ValidationError {
    var prototype: any;
}
export default ValidationError;
