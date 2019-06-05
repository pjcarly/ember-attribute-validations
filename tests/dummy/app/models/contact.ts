import Model from 'ember-data/model';
import { attr } from '@ember-decorators/data';
import { validationModel } from 'ember-attribute-validations/decorators/validation-model';

@validationModel
export default class ContactModel extends Model {
  @attr('string', {
    validation: {
      required: true
    }
  })
  firstName !: string;

  @attr('string', {
    validation: {
      required: true
    }
  })
  lastName !: string;


  @attr('string', {
    validation: {
      email: true
    }
  })
  email !: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'contact' : ContactModel
  }
}
