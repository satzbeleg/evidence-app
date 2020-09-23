/** PWA */
import './registerServiceWorker';


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

/** v-fit-text-to-box */
// import Fit2Box from 'vue-fit2box';
import Fit2Box from '@/directives/fit2box';
app.directive('fit2box', Fit2Box);

/** Mount the app */
app.mount('#app');