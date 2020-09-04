/** Information
 * - Application Structure with Vuex: https://vuex.vuejs.org/guide/structure.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login.js';
import settings from './modules/settings';
import swipe1 from './modules/swipe1.js';
Vue.use(Vuex);


/** Sync Vuex states with browser's localStorage */
import VuexPersist from 'vuex-persist';
import localForage from 'localforage'
const vuexStorage = new VuexPersist({
  key: 'vuex-my-app-name', // name of the store in storage API
  // storage: window.localStorage,
  storage: localForage, // alternative is 'window.localStorage'
  asyncStorage: true, // required for localForage, see https://github.com/championswimmer/vuex-persist/issues/117#issuecomment-493906644
});


const store = new Vuex.Store({
  modules: {
    login: login,
    settings: settings,
    swipe1: swipe1
  },
  plugins: [vuexStorage.plugin]
});


export default store;