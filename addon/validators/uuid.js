import PatternValidator from 'ember-attribute-validations/pattern-validator';
import { computed } from '@ember/object';
import { get } from '@ember/object';
import { assert } from '@ember/debug';

const uuid = {
  '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

export default PatternValidator.extend({
  /**
   * Version of the UUID format.
   *
   * By default it would try to validate 1 or 2 versions.
   *
   * Valid arguments are all, 3, 4, 5
   *
   * @property version
   * @type {String}
   * @default all
   */
  version: 'all',

  pattern: computed('version', function() {
    const version = get(this, 'version');
    const pattern = uuid[version];

    assert('Invalid UUID version `' + version + '`.', !!pattern);

    return pattern;
  })
});
