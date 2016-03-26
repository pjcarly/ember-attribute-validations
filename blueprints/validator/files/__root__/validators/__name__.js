import Validator from 'ember-attribute-validations/validator';

export default Validator.extend({
  validate: function(name, value, attribute, model) {
    // add your custom validation
  }
});
