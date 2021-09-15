import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import type IntlService from 'ember-intl/services/intl';

export default class ApplicationRoute extends Route {
  @service intl!: IntlService;

  beforeModel() {
    // @ts-ignore
    super.beforeModel(...arguments);
    this.intl.setLocale(["en-001"]); // we set the locale to english international
  }
}
