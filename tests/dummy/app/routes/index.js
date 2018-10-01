import Route from '@ember/routing/route';

export default Route.extend({
  model() {
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
