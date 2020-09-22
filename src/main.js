import Vue, { createApp, h } from 'vue';
import App from './App.vue';
import router from './router';

/** fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
Vue.component('vue-fontawesome', FontAwesomeIcon);

/** load Buefy for Vue */
import Buefy from 'buefy';
//import 'buefy/dist/buefy.css'; // must be deactivated if SCSS is used
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

/** PWA */
import './registerServiceWorker';

/** Meta data */
import VueMeta from 'vue-meta';
Vue.use(VueMeta, {
  keyName: 'head'
});

/** i18n */
import i18n from '@/translations';

/** Vuex state management */
import store from './store';

/** v-fit-text-to-box */
import Fit2Box from 'vue-fit2box';
//import Fit2Box from '@/directives/fit2box';
Vue.directive('fit2box', Fit2Box);

createApp({
  i18n,
  render: () => h(App)
}).use(router).use(store).mount('#app');