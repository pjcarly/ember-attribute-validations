import DefaultMessageResolver from 'ember-attribute-validations/message-resolver';

export function initialize() {
	var application;

	if(arguments.length > 1) {
		application = arguments[1];
	} else {
		application = arguments[0];
	}

	application.register('ember-attribute-validations@resolver:validation-message', DefaultMessageResolver);
}

export default {
  name: 'data-validation',
  initialize: initialize
};
