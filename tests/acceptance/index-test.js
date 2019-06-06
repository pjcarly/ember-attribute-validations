import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import { run } from '@ember/runloop';
import { visit, andThen } from '@ember/test-helpers';

var application;

module('Acceptance | index', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    run(application, 'destroy');
  }
});

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal('', '');
  });
});
