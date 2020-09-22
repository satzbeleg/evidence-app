// import Vue from 'vue';
import { createI18n } from 'vue-i18n';
// Vue.use(VueI18n);

/** Custom formatter 
 * https://kazupon.github.io/vue-i18n/guide/formatting.html#custom-formatting
 * https://github.com/kazupon/vue-i18n/tree/dev/examples/formatting/custom
 */
import MessageFormat from 'messageformat';

class CustomFormatter {
  constructor(options = {}) {
    this._locale = options.locale || 'de'
    this._formatter = new MessageFormat(this._locale)
    this._caches = Object.create(null)
  }

  interpolate(message, values) {
    let fn = this._caches[message]
    if (!fn) {
      fn = this._formatter.compile(message, this._locale)
      this._caches[message] = fn
    }
    return [fn(values)]
  }
}

/** Specify default language
 * 1. Read from user settings (MISSING! Feature)
 * 2. Use the browser's language setting
 * 3. Select a hardcoded default language (e.g. 'de')
 */
const default_locale = navigator.language || 'de';


/** Register standard messages 
 * - messages: HomeWorld.vue
 * - header: TheHeader.vue (navigation) 
 * - settings: Settings.vue
 */
export default createI18n({
  locale: default_locale,
  formatter: new CustomFormatter({ default_locale }),
  messages: {
    'de': require('./de.json'),
    'en-US': require('./en-US.json')
  }
})