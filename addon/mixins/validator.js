import Mixin from "@ember/object/mixin";
import { reject } from "rsvp";
import { inject as service } from "@ember/service";


/**
 * Validator Mixin to be used on a DS.Model.
 *
 * Exposes the validation functionality for Ember Models.
 *
 * @class ValidatorMixin
 */
export default Mixin.create({
  intl: service(),
  validator: service(),


  validatorsFor(attribute) {
    this.validator.validatorsFor(attribute);
  },

  _validateAttribute(attribute) {
    this.validator._validateAttribute(this, attribute);
  },


  _validateRelationship(relationship) {
    this.validator._validateRelationship(this, relationship);
  },


  validate() {
    this.validator.validateModel(this);
  },

  _addValidationError(attribute, message) {
    this.validator._addValidationError(this, attribute, message);
  },

  /**
   * Override of the Save method of DS.Model
   * @param {*} param0 Options for the save method. Pass validate=false if you want to ignore validation
   */
  save({ validate = true } = {}) {
    if (!validate) {
      return this._super();
    }

    if (this.validate()) {
      return this._super();
    }

    return reject(this.validator.createValidationError(this));
  },
});
