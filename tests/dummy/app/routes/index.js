import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model: function () {

    this.store.push({
      data: {
        type: 'test',
        id: 1,
        attributes: {}
      }
    });

    return this.store.recordForId('test', 1);
  }
});
