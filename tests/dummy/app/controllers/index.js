import Ember from 'ember';

const { Controller } = Ember;

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
