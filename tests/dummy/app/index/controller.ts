import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import TestModel from '../models/test';

export default class IndexController extends Controller {
  model !: TestModel;

  @action
  save() {
    this.model.save()
    .catch((e: any) => {
      console.error(e.stack);
    });
  }
}
