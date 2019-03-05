import Application from '../../app';
import config from '../../config/environment';
import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';

export default function startApp(attrs) {
  var application;

  var attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
