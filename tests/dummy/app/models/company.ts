import Model from 'ember-data/model';
import { attr } from '@ember-decorators/data';
import { validationModel } from 'ember-attribute-validations/decorators/validation-model';

@validationModel
export default class CompanyModel extends Model {
  @attr('string', {
    validation: {
      required: true
    }
  })
  name !: string;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'company' : CompanyModel
  }
}
