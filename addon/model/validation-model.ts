import Model from "@ember-data/model";
import { inject as service } from "@ember/service";
import RSVP, { reject } from "rsvp";
import ValidatorService from "../service/validator";

export default class ValidationModel extends Model {
  @service intl!: any;
  @service validator!: ValidatorService;

  validate(): boolean {
    return this.validator.validateModel(<Model>this);
  }

  /**
   * Override of the Save method of DS.Model
   * @param {*} param0 Options for the save method. Pass validate=false if you want to ignore validation
   */
  save(
    options?:
      | {
          adapterOptions?: object | undefined;
          validate?: boolean;
        }
      | undefined
  ): RSVP.Promise<this> {
    if (options && options.validate === false) {
      return super.save(...arguments);
    }

    if (this.validate()) {
      return super.save(...arguments);
    }

    return reject(this.validator.createValidationError(this));
  }
}
