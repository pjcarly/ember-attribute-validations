import Model from 'ember-data/model';
import ValidatorMixin from 'ember-attribute-validations/mixins/validator';
import { attr } from '@ember-decorators/data';

export default class TestModel extends Model.extend(ValidatorMixin) {
  @attr('string', {
    validation: {
      required: true,
      min: 5,
      range: {
        from: 3,
        to: 10
      }
    }
  })
  name !: string;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'test' : TestModel
  }
}
