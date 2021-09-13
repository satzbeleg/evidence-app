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
import router from '@/router';
app.use(router);

/** i18n */
import i18n from '@/translations';
app.use(i18n);

/** v-fit-text-to-box */
import Fit2Box from 'vue-fit2box';
app.directive('fit2box', Fit2Box);

/** Mount the app */
app.mount('#app');

/* Bulma CSS */
import 'bulma/css/bulma.min.css';
import 'bulma-switch/dist/css/bulma-switch.min.css';
import 'bulma-slider/dist/css/bulma-slider.min.css';
import 'bulma-pageloader/dist/css/bulma-pageloader.min.css';
