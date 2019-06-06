import Validator from 'ember-attribute-validations/validator';
import Model from 'ember-data/model';
import { hasValue, toDate } from '../utils';


/**
 * Validator that checks if the Attribute value is a valid Date.
 *
 * @class DateValidator
 * @extends {Validator}
 */
export default class DateValidator extends Validator {
  name = 'date';

  validate(_: string, value: any, _2: any, _3: Model) : string | boolean {

    if(hasValue(value)) {
      const date = toDate(value);

      //@ts-ignore
      if(isNaN(date) || date === null) {
        return this.format();
      }
    }

    return false;
  }
}
