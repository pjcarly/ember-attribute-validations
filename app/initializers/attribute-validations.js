import { registerLibrary } from '@getflights/ember-attribute-validations/version';

export function initialize(/* container, application */) {
  registerLibrary();
}

export default {
  name: 'attribute-validations',
  initialize,
};
