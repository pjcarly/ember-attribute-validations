import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    save: function() {
      var model = this.get('model');

      console.log(model);

      model.save().catch(function(e) {
        console.error(e.stack);
      });
    }
  }
});
