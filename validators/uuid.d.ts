import PatternValidator from "ember-attribute-validations/pattern-validator";
export default class UUIDValidator extends PatternValidator {
    /**
     * Version of the UUID format.
     *
     * By default it would try to validate 1 or 2 versions.
     *
     * Valid arguments are all, 3, 4, 5
     *
     * @property version
     * @type {String}
     * @default all
     */
    version: string;
    get pattern(): RegExp;
}
