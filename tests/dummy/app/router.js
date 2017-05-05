import Ember from 'ember';
import config from './config/environment';

const { Router } = Ember;

var Router = Router.extend({
  location: config.locationType
});

Router.map(function() {
});

export default Router;
