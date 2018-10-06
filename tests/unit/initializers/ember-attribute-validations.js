import Application from '@ember/application';
import { initialize } from '../../../initializers/ember-attribute-validations';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';

var container, application;

module('Unit | Initializer | ember cli data validation', {
  beforeEach() {
    run(function() {
      application = Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(container, application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
