import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  model() {
    this.store.push({
      data: {
        type: 'test',
        id: 1,
        attributes: {}
      }
    });

    return this.store.peekRecord('test', 1);
  }
}
