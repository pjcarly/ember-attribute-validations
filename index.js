'use strict';

module.exports = {
  name: require('./package').name,
  isDevelopingAddon() {
    return true;
  },
  included() {
    this._super.included.apply(this, arguments);
    const packageJson = require('./package.json');

    this.options['@embroider/macros'].setOwnConfig.version =
      packageJson.version;
    this.options['@embroider/macros'].setOwnConfig.name = packageJson.name;
  },
  options: {
    '@embroider/macros': {
      setOwnConfig: {},
    },
  },
};
