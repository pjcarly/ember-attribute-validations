import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';

const { merge, run } = Ember;

export default function startApp(attrs) {
  var application;

  var attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
