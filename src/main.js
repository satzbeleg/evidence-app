/** fontawesome */
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// library.add(fas);

// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// Vue.component('vue-fontawesome', FontAwesomeIcon);

/** load Buefy for Vue */
// import Buefy from 'buefy';
// //import 'buefy/dist/buefy.css'; // must be deactivated if SCSS is used
// Vue.use(Buefy, {
//   defaultIconComponent: 'vue-fontawesome',
//   defaultIconPack: 'fas',
// });

/** PWA */
import './registerServiceWorker';

/** Meta data */
// import VueMeta from 'vue-meta';
// Vue.use(VueMeta, {
//   keyName: 'head'
// });

/** v-fit-text-to-box */
// import Fit2Box from 'vue-fit2box';
//import Fit2Box from '@/directives/fit2box';
// Vue.directive('fit2box', Fit2Box);


/** Load packages */
import { createApp, h } from 'vue';
import App from './App.vue';

/** Add everything together */
const app = createApp({
  render: () => h(App)
});

/** Vue Router */
import router from './router';
app.use(router);
// router.isReady().then(() => app.use(router));

/** Vuex state management */
import store from './store';
app.use(store);
// store.isReady().then(() => app.use(store));

/** i18n */
import i18n from '@/translations';
app.use(i18n);


/** Mount the app */
app.mount('#app');
